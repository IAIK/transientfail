# Meltdown-US PoC

This folder contains a Meltdown-US proof-of-concept implementation for x86_64 and ARMv8.

## Compile

Compile using `make x86` for the x86_64 version, or `make arm` for the ARMv8 version.

## Run

Run with `./poc_x86` or `./poc_arm` for x86_64 or ARMv8 respectively.

The expected output is
```
S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S
```

## How it works
In our PoC, we create a shared mapping to a piece of memory. For one mapping, we clear the userspace-accessible bit using libpte (PTEditor), the other one remains a valid mapping that is accessible from userspace. This valid mapping is required to load the data into the cache. Our PoC also works if the data is not in the cache, but it takes longer to leak data.

We leak the data by accessing it through the non-accessible mapping and encode the data in the cache by accessing a page depending on the loaded value. We recover the data using a Flush+Reload attack. In our PoC, we suppress the page fault either via Intel TSX or segfault handling. Another possibility would be to hide the faulting access in speculation.

## Troubleshooting

* The output is garbage (mostly just (random letters))
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
    + **Solution #2 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER.

* The program does not leak anything
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_arm`. Try different cores.
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1".
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
    + **Solution #4 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER.
