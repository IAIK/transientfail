all: x86

x86: main_x86
arm: main_arm

main_x86: main.c
	gcc main.c -o poc_x86 -Os -I../../../ 

main_arm: main.c
	aarch64-linux-gnu-gcc -march=armv8-a -D__ARM_ARCH_8A__ -static -Os main.c -o poc_arm -I../../../

clean:
	rm -f poc_*
