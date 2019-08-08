# Spectre-BTB PoC 

This folder contains a Spectre-BTB proof-of-concept implementation for x86_64 and ARMv8. 

## Compile

Compile using `make x86` for the x86_64 version or `make arm` for the ARMv8 version. 

## Run

Run with `./poc_x86` or `./poc_arm` for x86_64  or ARMv8 respectively. 

The expected output is
```
S S S S S S S S S S S S S S S S
```

## How it works
This PoC uses a class from which two subclasses are derived. One class Bird contains the secret data and a implements the function `move` so that it does nothing. The other class, Fiish, contains some dummy data and the implements the function `move` so that it encodes the member variable in the cache. The functinon `move_animal` then expects the base class as a parameter and calls the virtual function `move`. By first mistraining this function with an Animal of type Bird and then substituting the Animal with a Fish we are able to leak the data as the call is mispredicted.

## Troubleshooting

* The output is garbage (mostly just "AAAAAAAAAA...")
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses. 
    + **Solution #2 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER. 
 
* The program appears to hang in "Leak secret..."
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_arm`. Try different cores. 
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1". 
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses. 
    + **Solution #4 (ARM only):** Try a different method to measure time: Change the ARM_CLOCK_SOURCE in libcache/cache.h to ARM_PERF, ARM_CLOCK_MONOTONIC, or ARM_TIMER. 
