# Meltdown-SS PoC

This folder contains a Meltdown-SS proof-of-concept implementation for x86_64.

## Compile

Compile using `make x86` for the x86_64 version.

## Run

Run with `./poc_x86` for x86_64.

If the PoC is successfull the output is
```
S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S
```

## How it works
In this PoC, we modify the Local Descriptor Table so that we can trigger a stack-segment fault. We then try to encode the secret value in the cache. Exception suppression is done by either via Intel TSX or segfault handling.

## Troubleshooting

* The output is garbage (mostly just (random letters))
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.

* The program does not leak anything
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_arm`. Try different cores.
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1".
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
