#ifndef CACHEUTILS_H
#define CACHEUTILS_H

#ifndef HIDEMINMAX
#define MAX(X,Y) (((X) > (Y)) ? (X) : (Y))
#define MIN(X,Y) (((X) < (Y)) ? (X) : (Y))
#endif

#define MEASURE(op) \
    ({ \
        size_t begin = rdtsc(); \
        op \
        size_t end = rdtsc(); \
        end - begin; \
    })

inline __attribute__((always_inline)) uint64_t rdtsc() {
  uint64_t a, d;
  asm volatile (
    "mfence\n\t"
    "RDTSCP\n\t"
    "mov %%rdx, %0\n\t"
    "mov %%rax, %1\n\t"
    "xor %%rax, %%rax\n\t"
    "CPUID\n\t"
    : "=r" (d), "=r" (a)
    :
    : "%rax", "%rbx", "%rcx", "%rdx");
  a = (d<<32) | a;
  return a;
}

#define MACCESS(p,s,t) asm volatile ("movq (%0), %%r" t "x" : : s (p) : "r" t "x")

inline __attribute__((always_inline)) void maccess(volatile void* p)
{
  asm volatile ("movb (%0), %%al\n"
    :
    : "c" (p)
    : "rax");
}

inline __attribute__((always_inline)) void flush(void* p) {
    asm volatile ("clflush 0(%0)\n\t"
      :
      : "c" (p)
      : "rax");
}

#endif
