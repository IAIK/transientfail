ifndef MPX
    MPX             = 1
endif

ifndef TSX
    TSX             = 0
endif

ifndef LFENCE
    LFENCE          = 0
endif

ifeq ($(M32),1)
    CFLAGS          += -m32 -DM32=1
endif

ifeq ($(MPX),1)
    CFLAGS          += -mmpx -fcheck-pointer-bounds
endif

CFLAGS              += -DLFENCE=$(LFENCE) -DUSE_TSX=$(TSX) -I../../

all: x86

x86: main_x86

main_x86: main.c
	gcc $(CFLAGS) main.c -o poc_x86

clean:
	rm -f poc_*
