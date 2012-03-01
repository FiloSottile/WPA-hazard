#!/usr/bin/env python
#-*- coding:utf-8 -*-

# python config.py config/config.* | grep -v 'k-rule'

import sys
try:
    with file('config.txt') as f:
        present = f.read()
except IOError:
    present = ''
with file('config.txt', 'a') as config:
    for source in sys.argv[1:]:
        with file(source) as f:
            for line in f.readlines():
                if not ';' in line: 
                    print 'Ignored:', line.strip()
                    continue # f.write(line)
                l = line.split(';')[0].strip('"')
                magic = l.split(',')
                if len(magic) != 5: 
                    continue
                    print 'Ignored:', magic
                    
                magic[4] = magic[4].upper()
                if magic[0].endswith('X') or magic[0].endswith('x'): magic[0] = magic[0][:-1]
                
                formattato = '"%s,%s,%s,%s,%s";' % (magic[0], magic[1], magic[2], magic[3], magic[4])
                if 'X' in formattato or 'x' in formattato: 
                    print 'Ignored:', l
                    continue
                if formattato in present: 
                    # Presente
                    continue
                if magic[2] == '13' and magic[1][-1] in ('1', '2'): 
                    print >> config, formattato
                    present += formattato
                    print 'Added:', formattato
                if magic[2] == '8' and magic[1][-1] in ('3', '4'): 
                    print >> config, formattato
                    present += formattato
                    print 'Added:', formattato
                print 'Ignored (k-rule):', l
