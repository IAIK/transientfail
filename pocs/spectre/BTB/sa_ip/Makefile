all: x86

x86: main_x86
arm: main_arm

main_x86: main.cpp
	g++ main.cpp -o poc_x86 -Os -I../../../ 

main_arm: main.cpp
	aarch64-linux-gnu-g++ -march=armv8-a -D__ARM_ARCH_8A__ -static -Os main.cpp -o poc_arm -I../../../

clean:
	rm -f poc_*
