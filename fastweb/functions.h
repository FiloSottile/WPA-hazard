#ifndef functions_h
#define functions_h

void ToUpper(char* str);

// Date "count" coppie di caratteri hex in hexpairs ne restituisce i valori in un array di byte chars
void HexSequenceToChar(const char* hexpairs, unsigned char* chars, unsigned int count);

// Controlla se il dato mac ha un OUI Pirelli
_Bool IsPirelli(const char* mac);

// Dato il valore v lo restituisce in binari nella stringa binstr di lunghezza len
void IntToStrBinary(unsigned int v, char* binstr, unsigned int len);

// Toglie tutte le occorrenze di ch da str
void RemoveChar(char* str, const char ch);

#endif
