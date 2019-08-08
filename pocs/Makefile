all: libcache/cacheutils.h libpte/libpte.a meltdown/US meltdown/P meltdown/RW meltdown/NM meltdown/GP meltdown/PK meltdown/DE meltdown/SS meltdown/UD meltdown/AC meltdown/BR spectre/pht/sa_ip spectre/pht/sa_oop spectre/pht/ca_ip spectre/pht/ca_oop spectre/btb/sa_ip spectre/btb/sa_oop spectre/btb/ca_ip spectre/rsb/sa_ip spectre/rsb/sa_oop spectre/rsb/ca_ip spectre/rsb/ca_oop spectre/stl

libcache/cacheutils.h: libcache/cache.h libcache/cache.c 
	cd libcache  && make

libpte/libpte.a:
	cd libpte && make

meltdown/US: meltdown/US/main.c libpte/libpte.a libcache/cacheutils.h
	cd meltdown/US && make

meltdown/P: meltdown/P/main.c libpte/libpte.a libcache/cacheutils.h
	cd meltdown/P && make

meltdown/RW: meltdown/RW/main.c libpte/libpte.a libcache/cacheutils.h
	cd meltdown/RW && make

meltdown/NM: meltdown/NM/main.c meltdown/NM/victim.c meltdown/NM/secret.h libcache/cacheutils.h
	cd meltdown/NM && make

meltdown/GP: meltdown/GP/main.c meltdown/GP/module/kernel_module.c libcache/cacheutils.h
	cd meltdown/GP && make

meltdown/PK: meltdown/PK/main.c libcache/cacheutils.h
	cd meltdown/PK && make

meltdown/DE: meltdown/DE/main.c libcache/cacheutils.h
	cd meltdown/DE && make

meltdown/SS: meltdown/SS/main.c libcache/cacheutils.h
	cd meltdown/SS && make

meltdown/UD: meltdown/UD/main.c libcache/cacheutils.h
	cd meltdown/UD && make

meltdown/AC: meltdown/AC/main.c libcache/cacheutils.h
	cd meltdown/AC && make

meltdown/BR: meltdown/BR/main.c libcache/cacheutils.h
	cd meltdown/BR && make

spectre/pht/sa_ip: spectre/PHT/sa_ip/main.c
	cd spectre/PHT/sa_ip && make

spectre/pht/sa_oop: spectre/PHT/sa_oop/main.c libcache/cacheutils.h
	cd spectre/PHT/sa_oop && make

spectre/pht/ca_ip: spectre/PHT/ca_ip/main.c libcache/cacheutils.h 
	cd spectre/PHT/ca_ip && make

spectre/btb/sa_ip: spectre/BTB/sa_ip/main.cpp libcache/cacheutils.h
	cd spectre/BTB/sa_ip && make

spectre/btb/sa_oop: spectre/BTB/sa_oop/main.c libcache/cacheutils.h
	cd spectre/BTB/sa_oop && make

spectre/btb/ca_ip: spectre/BTB/ca_ip/main.cpp libcache/cacheutils.h
	cd spectre/BTB/ca_ip && make

spectre/pht/ca_oop: spectre/PHT/ca_oop/main.c libcache/cacheutils.h
	cd spectre/PHT/ca_oop && make

spectre/rsb/sa_ip: spectre/RSB/sa_ip/main.c libcache/cacheutils.h
	cd spectre/RSB/sa_ip && make

spectre/rsb/sa_oop: spectre/RSB/sa_oop/main.c libcache/cacheutils.h
	cd spectre/RSB/sa_oop && make

spectre/rsb/ca_ip: spectre/RSB/ca_ip/main.c libcache/cacheutils.h
	cd spectre/RSB/ca_ip && make

spectre/rsb/ca_oop: spectre/RSB/ca_oop/main.c libcache/cacheutils.h
	cd spectre/RSB/ca_oop && make

spectre/stl: spectre/STL/main.c libcache/cacheutils.h
	cd spectre/STL/ && make

clean:
	cd libcache && make clean
	cd libpte && make clean
	cd meltdown/US && make clean
	cd meltdown/P && make clean
	cd meltdown/RW && make clean
	cd meltdown/NM && make clean
	cd meltdown/GP && make clean
	cd meltdown/PK && make clean
	cd meltdown/DE && make clean
	cd meltdown/SS && make clean
	cd meltdown/UD && make clean
	cd meltdown/AC && make clean
	cd meltdown/BR && make clean
	cd spectre/PHT/sa_ip && make clean
	cd spectre/PHT/sa_oop && make clean
	cd spectre/PHT/ca_ip && make clean
	cd spectre/PHT/ca_oop && make clean
	cd spectre/BTB/sa_ip && make clean
	cd spectre/BTB/sa_oop && make clean
	cd spectre/BTB/ca_ip && make clean	
	cd spectre/RSB/sa_ip && make clean
	cd spectre/RSB/sa_oop && make clean
	cd spectre/RSB/ca_ip && make clean
	cd spectre/RSB/ca_oop && make clean
	cd spectre/STL/ && make clean
