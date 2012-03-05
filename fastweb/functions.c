#include <string.h>
#include <stdlib.h>

void ToUpper(char* str) {
    char diff = (int)'a' - (int)'A';
    char buffer[strlen(str)+1];
    for (unsigned short i = 0; i<strlen(str)+1; i++) {
        if (str[i] >= 'a' && str[i] <= 'z') buffer[i] = str[i]-diff;
        else buffer[i] = str[i];
    }
    strcpy(str, buffer);
}

void HexSequenceToChar(const char* hexpairs, unsigned char* chars, unsigned int count) {
    char* couple = (char*) malloc(3);
    couple[2] = '\0'; // Ecco il memory leak! Se qui c'era un numero, strtoul lo leggeva!
    for (unsigned int i=0; i<count; i++) {
        strncpy(couple, hexpairs+(2*i), 2);
        unsigned int hx = strtoul(couple, NULL, 16);
        chars[i] = (unsigned char)hx;
    }
}

_Bool IsPirelli(const char* mac) {
    const char* PIRELLI_OUI = "000827-0013C8-0017C2-00193E-001CA2-001D8B-002233-00238E-002553-00A02F-080018-3039F2-38229D-6487D7-00268D";
    // 00268D è un CellTel di cui la pirelli ha comprato qualche scheda per la serie 181
    char buffer[7];
    buffer[6] = '\0';
    strncpy(buffer, mac, 6);
    ToUpper(buffer);
    _Bool res = 0;
    for (short unsigned int i = 0; i<14; i++) {
        if (!strncmp(buffer, PIRELLI_OUI+(i*7), 6)) res = 1;
    }
    return res;
}

void IntToStrBinary(unsigned int v, char* binstr, unsigned int len) {
    for (unsigned int i=0; i<len; i++) {
        binstr[len-1-i] = v & 1 ? '1' : '0' ;
        v = v / 2 ;
    }
    binstr[len] = '\0';
}

void RemoveChar(char* str, const char ch) {
    char buffer[strlen(str)+1];
    unsigned short n = 0;
    for (unsigned short i = 0; i<strlen(str)+1; i++) {
        if (str[i] != ch) buffer[n++] = str[i];
    }
    strcpy(str, buffer);
}
