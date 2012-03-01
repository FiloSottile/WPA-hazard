#ifndef functions_hpp
#define functions_hpp
void ToUpper(char* str);
void HexSequenceToChar(const char* hexpairs, unsigned char* chars, unsigned int count);
bool IsPirelli(const char* mac);
void IntToStrBinary(unsigned int v, char* binstr, unsigned int len);
void RemoveChar(char* str, const char ch);
#endif
