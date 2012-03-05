ifdef DEBUG
    CC = gcc -std=c99 -Wall -g
    W_CC = i586-mingw32msvc-gcc -std=c99 -Wall -g
else
    CC = gcc -std=c99 -Wall -s -O3
    W_CC = i586-mingw32msvc-gcc -std=c99 -Wall -s -O3
endif

.PHONY: all
all: fastweb fastweb.static fastweb.exe

md5.o: md5.c md5.h global.h
	$(CC) -o $@ -c $<
lookup3.o: lookup3.c
	$(CC) -o $@ -c $<
functions.o: functions.c
	$(CC) -o $@ -c $<
fastweb.o: fastweb.c md5.h global.h lookup3.h functions.h
	$(CC) -o $@ -c $<
	
md5.w.o: md5.c md5.h global.h
	$(W_CC) -o $@ -c $<
lookup3.w.o: lookup3.c
	$(W_CC) -o $@ -c $<
functions.w.o: functions.c
	$(W_CC) -o $@ -c $<
fastweb.w.o: fastweb.c md5.h global.h lookup3.h functions.h
	$(W_CC) -o $@ -c $<
	
fastweb.static: fastweb.o md5.o lookup3.o functions.o
	$(CC) -static -o $@ $^
fastweb: fastweb.o md5.o lookup3.o functions.o
	$(CC) -o $@ $^
fastweb.exe: fastweb.w.o md5.w.o lookup3.w.o functions.w.o
	$(W_CC) -o $@ $^
	
.PHONY: clean
clean: part-clean
	-rm -f fastweb fastweb.static fastweb.exe

.PHONY: part-clean
part-clean:
	-rm -f fastweb.o lookup3.o md5.o fastweb.w.o lookup3.w.o md5.w.o functions.o functions.w.o

.PHONY: check
check: 
	bash check.sh
