all: header

header: cache.c cache.h
	cat cache.h cache.c | sed 's/#include ".*"//g' > cacheutils.h

clean:
	rm -f cacheutils.h
