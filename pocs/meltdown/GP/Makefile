all: x86

x86: main_x86

module/kernel_module.ko: module/kernel_module.c
	cd module && make

main_x86: main.c module/kernel_module.ko
	gcc main.c -o poc_x86 -O3 -I../../

clean:
	rm -f poc_* && cd module && make clean
