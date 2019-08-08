# Meltdown-BR PoC

This folder contains a Meltdown-BND and Meltdown-MPX proof-of-concept implementation for x86_64.

## Compile

Compile using `make x86` for the x86_64 version.

## Run

Run with `./poc_x86` for x86_64.

The expected output is
```
dog[0] = 'a' (recovered 'a')
dog[1] = 'b' (recovered 'b')
dog[2] = 'c' (recovered 'c')
dog[3] = 'x' (recovered 'x')
PF 0: dog[4] = 'y' (recovered 'y')
```

## How it works
In our PoC, we map a piece of memory that we want to protect either the x86 bound instruction or via Intel MPX. After doing the setup for protecting the data, we access the data and encode it in the cache. We suppress the bound-range-exceeded exception either via Intel TSX or segfault handling.

## Troubleshooting

* The output is garbage (mostly just (random letters))
    + **Solution #1:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.

* The program does not leak anything
    + **Solution #1:** Pin the program to one CPU core: `taskset 0x2 ./poc_x86`. Try different cores.
    + **Solution #2:** Cause a lot of interrupts by running e.g. `stress -i 1 -d 1`. This can be combined with Solution #1".
    + **Solution #3:** Manually set the variable `CACHE_MISS` in main.c to a threshold which allows distinguishing cache hits from misses.
