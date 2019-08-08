# Meltdown-PK PoC

This folder contains a Meltdown-PK proof-of-concept implementation for x86_64.

## Compile

Compile using `make x86` for the x86_64 version.

## Run

Run with `./poc_x86` for x86_64.

The expected output is
```
S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S
```

## How it works
In our PoC, we assign a protection key to a buffer containing the secret. In each iteration, we disable the protection, access the data, and re-enable the protection. This is to ensure that the data is cached.

We leak the data by accessing the protected buffer and encode the data in the cache by accessing a page depending on the loaded value. We recover the data using a Flush+Reload attack. In our PoC, we suppress the page fault either via Intel TSX or segfault handling. Another possibility would be to hide the faulting access in speculation.

This PoC requires a CPU that supports Intel MPK.

## Troubleshooting

* The output is garbage (mostly just (random letters))
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.

* The program does not leak anything
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_x86`. Try different cores.
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1".
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
