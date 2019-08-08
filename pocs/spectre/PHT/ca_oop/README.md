# Spectre-PHT PoC 

This folder contains a Spectre-PHT proof-of-concept implementation for x86_64 and ARMv8. 

## Compile

Compile using `make x86` for the x86_64 version or `make arm` for the ARMv8 version. 

## Run

Run with `./poc_x86` or `./poc_arm` for x86_64 or ARMv8 respectively. 

The expected output is
```
[*] Flush+Reload Threshold: 180
[ ]  INACCESSIBLE SECRET 

[>] Done
```

## How it works

The array `data` stores some accessible data (defined in `DATA`) followed by some inaccessible data (defined in `SECRET`). The `access_array` function takes an index to the array and checks whether it accesses the "accessible" part of the array. 
If so, it encodes the value at the given index in the cache (cf. Spectre or Meltdown attack). If this bound check is mistrained often enough, the CPU (speculatively) executes the code inside the condition also for invalid indices (i.e., indices out of bounds).

The longer the condition takes to resolve, the higher the probability that the CPU (mis)speculates. Thus, the length check is written as division (which is usually a slow operation).

```
x < len  <=>  x / len < 1
```
(assuming both the length of the data as well as the index to the array are positive)

For the out-of-place mistraining of the Pattern History Table (PHT) that is responsible for the prediction we simply fill a large chunk of memory with a jump if equal follwing a comparison. We do this as we do not know the exact bits that are used for indexing the PHT.
In this version, we also fork and to the mistraining in one process while the other process performs the out-of-bounds access and recovering of the data.


## Troubleshooting

* The output is garbage (mostly just "AAAAAAAAAA...")
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses. 
    + **Solution #2 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER. 
 
* The program appears to hang in "Leak secret..."
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_arm`. Try different cores. 
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1". 
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses. 
    + **Solution #4 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER. 
    + **Solution #5:** This PoC depends on the code the compiler emits. Try inverting the JE macro or the if-statement in the mistraining function
