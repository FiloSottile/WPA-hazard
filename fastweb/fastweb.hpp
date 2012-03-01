// Date "count" coppie di caratteri hex in hexpairs ne restituisce i valori in un array di byte chars
void HexSequenceToChar(const char* hexpairs, unsigned char* chars, unsigned int count)

// Dato il valore v lo restituisce in binari nella stringa binstr di lunghezza len
void IntToStrBinary(unsigned int v, char* binstr, unsigned int len)

// Toglie tutte le occorrenze di ch da str
void RemoveChar(char* str, const char ch)

// Mette tutte le lettere di str in maiuscolo
void ToUpper(char* str)

// Controlla se il dato mac ha un OUI Pirelli
bool IsPirelli(const char* mac)

// Dato un mac di 12 caratteri (coppie di hex) restituisce la key di 10 caratteri
void pirelli(char* key, const char* mac)
void telsey(char* key, const char* mac)
