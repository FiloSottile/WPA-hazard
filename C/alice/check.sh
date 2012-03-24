#! /bin/bash

exit
############ NOT UP-TO-DATE ##############

As="96140044"
Ap="3neykd9j73tr815a7pkis3xk"

fail=0

for bin in "./alice" "./alice.static" "wine alice.exe"
do
	t=$($bin $As 2> /dev/null | sed 's!\r!!') # Maledetto Windows e il suo \r
	if [ "x$t" != "x$Ap" ]; then 
		echo "$bin FAIL $As -> $t"
		fail=1
	fi
done

if [ $fail == 0 ]; then echo "All OK"; fi

exit $fail
