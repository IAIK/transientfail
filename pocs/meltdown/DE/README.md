# Meltdown-DE PoC

This folder contains a Meltdown-DE proof-of-concept implementation for x86_64 and ARMv8.

## Compile

Compile using `make x86` for the x86_64 version, or `make arm` for the ARMv8 version.

## Run

Run with `./poc_x86` or `./poc_arm` for x86_64 or ARMv8 respectively.

If the PoC is successfull the output is
```
d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d 
```

This indicates that the register is set to 0 and that Meltdown-DE does not work based on our PoC (we encourage testing other approaches).

## How it works
In this PoC, we encode try to encode the result of a division by zero in the cache that we subsequently want to leak using Flush+Reload. We prevent the exception from being raised either via Intel TSX or segfault handling. 

## Troubleshooting

* The output is garbage (mostly just (random letters))
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
    + **Solution #2 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER.

* The program does not leak anything
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_arm`. Try different cores.
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1".
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
    + **Solution #4 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER.
