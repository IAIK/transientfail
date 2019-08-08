all: pteditor ptedit.o header libpte.a

header: module/pteditor.c module/pteditor.h ptedit.c ptedit.h
	cat module/pteditor.h ptedit.h ptedit.c | sed 's/#include ".*"//g' > ptedit_header.h

pteditor: module/pteditor.c
	cd module && make

ptedit.o: ptedit.c ptedit.h
	gcc -Wall -Wextra ptedit.c -c

libpte.a: ptedit.o
	ar rcs libpte.a ptedit.o

clean:
	cd module && make clean
	rm -f example *.o *.a
