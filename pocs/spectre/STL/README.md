# Spectre-STL PoC 

This folder contains a Spectre-STL proof-of-concept implementation for x86_64 and ARMv8. 

## Compile

Compile using `make x86` for the x86_64 version or `make arm` for the ARMv8 version. 

## Run

Run with `./poc_x86` or `./poc_arm` for x86_64 or ARMv8 respectively. 

The expected output is
```
[*] Flush+Reload Threshold: 200
 INACCESSIBLE SECRET 

[>] Done
```

## How it works

The array `data` stores some inaccessible data (i.e., a secret). The `access_array` first overwrites the secret in `data` with a dummy value ("######"), and afterwards encodes the value in the cache (cf. Spectre or Meltdown attack). If the store is not (speculatively) executed by the CPU, the previous value (i.e., the actual secret) is read and thus leaked.


## Troubleshooting

* The output is garbage (mostly just "AAAAAAAAAA...")
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses. 
    + **Solution #2 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER. 

* The program does not leak anything
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_arm`. Try different cores. 
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1". 
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses. 
    + **Solution #4 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER.
