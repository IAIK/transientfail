# Meltdown-NM PoC

This folder contains a Meltdown-NM proof-of-concept implementation for x86_64.

## Compile

Compile using `make x86` for the x86_64 version.

## Run

Run with `./poc_x86` or `./poc_arm` for x86_64.

The expected output is
```
S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S S
```

## How it works
This PoC consists of two different process. The victim constantly loads the secret value into an AVX2 register. On a vulnerable CPU and OS, the register content is not saved on a context switch due to lazy switching. Our attacker process exploits this by loading the value from the AVX2 register and encodes it in the cache. The data is then recovered using a Flush+Reload attack.

## Troubleshooting

* The output is garbage (mostly just (random letters))
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.

* The program does not leak anything
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_x86`. Try different cores.
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1".
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
