# Meltdown-UD PoC

This folder contains a Meltdown-UD proof-of-concept implementation for x86_64 and ARMv8.

## Compile

Compile using `make x86` for the x86_64 version, or `make arm` for the ARMv8 version.

## Run

Run with `./poc_x86` or `./poc_arm` for x86_64 or ARMv8 respectively.

If the PoC is successfull the output is
```
S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S
```

## How it works
In this PoC, we try to encode a value in the cache following an illegal opcode exception. On x86, we use a wrong lock prefix to trigger the exception, on ARM we use the instruction that is defined to always throw the exception. We suppress the exception either via Intel TSX or segfault handling.

## Troubleshooting

* The output is garbage (mostly just (random letters))
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
    + **Solution #2 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER.

* The program does not leak anything
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_arm`. Try different cores.
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1".
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
    + **Solution #4 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER.
