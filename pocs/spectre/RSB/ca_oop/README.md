# Spectre-RSB PoC

This folder contains a Spectre-RSB proof-of-concept implementation for x86_64 and ARMv8.

## Compile

Compile using `make x86` for the x86_64 version, or `make arm` for the ARMv8 version.

## Run

Run with `./poc_x86` or `./poc_arm` for x86_64 or ARMv8 respectively.

The expected output is
```
S S S S S S S S S S S S S S S S S S     
```

## How it works

In this PoC, the victim constantly calls the function `wrong_return` and is put to sleep while the attacker (in his own process) manipulates the software stack by destroying the return address. Important is that the attacker does this in a function which is called so that the return address is pushed on the RSB. The attacker then returns from the function with an ordinary jump instead of a return so that the value is not popped from the RSB. When the victim wakes up it will return to the wrong location and leaks the secret data.

## Troubleshooting

* The output is garbage (mostly just "AAAAAAAAAA...")
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
    + **Solution #2 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER. 

* The program appears to hang 
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_arm`. Try different cores.
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1".
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
    + **Solution #4 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER. 
