# Meltdown-GP PoC

This folder contains a Meltdown-GP proof-of-concept implementation for x86_64.
For ARM, we used the PoC from https://github.com/lgeek/spec_poc_arm.

## Compile

Compile using `make x86` for the x86_64 version.

## Run

Run with `./poc_x86` for x86_64.

The expected output depends on the content of the cr3 register.

## How it works
In this PoC, we encode the content of the cr3 register in the cache. This triggers a general-protection fault as the cr3 is a privileged reggister. We suppress this exception either via Intel TSX or segfault handling.

## Troubleshooting

* The output is garbage (mostly just (random letters))
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.

* The program does not leak anything
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_x86`. Try different cores.
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1".
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
