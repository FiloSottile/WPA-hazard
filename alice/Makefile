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
all: alice alice.static alice.exe

alice.o: alice.cpp sha2.h functions.hpp
	$(CPP) -o $@ -c $<
functions.o: functions.cpp
	$(CPP) -o $@ -c $<
sha2.o: sha2.c sha2.h
	$(CC) -o $@ -c $<

alice.w.o: alice.cpp sha2.h functions.hpp
	$(W_CPP) -o $@ -c $<
sha2.w.o: sha2.c sha2.h
	$(W_CC) -o $@ -c $<
functions.w.o: functions.cpp
	$(W_CPP) -o $@ -c $<
	
alice.static: alice.o sha2.o functions.o
	$(CPP) -static -o $@ $^
alice: alice.o sha2.o functions.o
	$(CPP) -o $@ $^
alice.exe: alice.w.o sha2.w.o functions.w.o
	$(W_CPP) -o $@ $^
	
.PHONY: clean
clean: part-clean
	-rm -f alice alice.static alice.exe

.PHONY: part-clean
part-clean:
	-rm -f alice.o alice.w.o sha2.o sha2.w.o ialice.o functions.w.o functions.o

# Not up-to-date
#.PHONY: check
#check: 
#	bash check.sh
	
.PHONY: config
config:
	python config.py config/* | grep -v 'k-rule'
