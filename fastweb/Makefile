ifdef DEBUG
    CC = gcc -Wall -g
    CPP = g++ -Wall -g
    W_CC = i586-mingw32msvc-gcc -Wall -g
    W_CPP = i586-mingw32msvc-g++ -Wall -g
else
    CC = gcc -Wall -s -O3
    CPP = g++ -Wall -s -O3
    W_CC = i586-mingw32msvc-gcc -Wall -s -O3
    W_CPP = i586-mingw32msvc-g++ -Wall -s -O3
endif

.PHONY: all
all: fastweb fastweb.static fastweb.exe

md5.o: md5.c md5.h global.h
	$(CC) -o $@ -c $<
lookup3.o: lookup3.c lookup3.h
	$(CC) -o $@ -c $<
functions.o: functions.cpp
	$(CPP) -o $@ -c $<
fastweb.o: fastweb.cpp md5.h global.h lookup3.h functions.hpp
	$(CPP) -o $@ -c $<
	
md5.w.o: md5.c md5.h global.h
	$(W_CC) -o $@ -c $<
lookup3.w.o: lookup3.c lookup3.h
	$(W_CC) -o $@ -c $<
fastweb.w.o: fastweb.cpp md5.h global.h lookup3.h functions.hpp
	$(W_CPP) -o $@ -c $<
functions.w.o: functions.cpp
	$(W_CPP) -o $@ -c $<
	
fastweb.static: fastweb.o md5.o lookup3.o functions.o
	$(CPP) -static -o $@ $^
fastweb: fastweb.o md5.o lookup3.o functions.o
	$(CPP) -o $@ $^
fastweb.exe: fastweb.w.o md5.w.o lookup3.w.o functions.w.o
	$(W_CPP) -o $@ $^
	
.PHONY: clean
clean: part-clean
	-rm -f fastweb fastweb.static fastweb.exe

.PHONY: part-clean
part-clean:
	-rm -f fastweb.o lookup3.o md5.o fastweb.w.o lookup3.w.o md5.w.o functions.o functions.w.o

.PHONY: check
check: 
	bash check.sh
