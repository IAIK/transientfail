# Transient Fail

Transient Fail is a project that gathers different proof-of-concept implementations of Transient Execution Attacks.

## Content
This project provides two different things:
* In the docs folder, we provide the source for the content of the [transient.fail](http://transient.fail) website.
* In the pocs folder, we provide our proof-of-concept implementations as well as two libraries required for them. Libcache is a small library that provides all the required functionality for time measurement, flushing and loading values, TSX transactions and so on. Libpte is a fork of [PTEditor](https://github.com/misc0110/PTEditor) developed by Michael Schwarz and allows manipulation of paging structures via a Linux kernel module.

## Status

Transient Fail is under active development as we add new proof-of-concepts that we discover during our research. We invite everybody who wants to contribute to do so via pull requests.

## Compilers and Operating Systems

So far, we only support Linux with gcc on x86 and ARMv8. Therefore, we have only tested them on such platforms, but welcome any feedback and pull requests on other platforms.

## Literature

* [Meltdown](meltdownattack.com)
* [Spectre](spectreattack.com)
* [Foreshadow](foreshadowattack.eu)
* [Systematic Evaluation](https://www.usenix.org/conference/usenixsecurity19/presentation/canella)
* [SpectreReturns](https://www.usenix.org/conference/woot18/presentation/koruyeh)
* [ret2spec](https://arxiv.org/pdf/1807.10364.pdf)
* [LazyFP](https://arxiv.org/pdf/1806.07480.pdf)

