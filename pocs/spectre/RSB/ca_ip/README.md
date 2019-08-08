# Spectre-RSB PoC

This folder contains a Spectre RSB proof-of-concept implementation for x86_64 and ARMv8.

## Compile

Compile using `make x86` for the x86_64 version, or `make arm` for the ARMv8 version.

## Run

Run with `./poc_x86` or `./poc_arm` for x86_64 or ARMv8 respectively.

The expected output is
```
S S S S S S S S S S
```

## How it works

In this PoC, both attacker and victim call the function `in_place` and areb put to sleep for different amount of time. With the call to `in_place` both the attacker and victim push their return address on the RSB. When the victim wakes up first it returns and pops the last address from the RSB. This causes it to misspeculate to the return address of the attacker where the secret data is leaked.

This PoC works as the RSB is not flushed on a context switch and therefore the value pushed by another process are used by another one. The RSB is not shared among hyperthreads, so both attacker and victim must run on the same logical core.

## Troubleshooting

* The output is garbage (mostly just "AAAAAAAAAA...")
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
    + **Solution #2 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER. 

* The program appears to hang
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_arm`. Try different cores.
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1".
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
    + **Solution #4 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER. 
