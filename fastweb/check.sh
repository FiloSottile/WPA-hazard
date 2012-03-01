#! /bin/bash

Tm="00:21:96:12:34:56"
Tp="0692ea9809"

Pm="00:1c:A2:aa:aa:aa"
Pp="0964080272"

fail=0

for bin in "./fastweb" "./fastweb.static" "wine fastweb.exe"
do
	t=$($bin $Tm | sed 's!\r!!') # Maledetto Windows e il suo \r
	if [ "x$t" != "x$Tp" ]; then 
		echo "$bin FAIL telsey -> $t"
		fail=1
	fi
	
	p=$($bin $Pm | sed 's!\r!!')
	if [ "x$p" != "x$Pp" ]; then
		echo "$bin FAIL pirelli -> $p"
		fail=1
	fi
done

if [ $fail == 0 ]; then echo "All OK"; fi

exit $fail
