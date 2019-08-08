all: x86

x86: main_x86

main_x86: main.c
	gcc main.c -o poc_x86 -O3 -I../../

clean:
	rm -f poc_*
