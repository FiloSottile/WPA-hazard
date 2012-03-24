if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}

function pad(string, n) {
    while (string.length < n) {
            string = '0' + string;
    }
    return string;
}

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 * Also http://anmar.eu.org/projects/jssha2/
 */
function hex2rstr(a){var b="";for(var c=0;c<a.length;c=c+2){b+=String.fromCharCode(parseInt(a.slice(c,c+2),16))}return b}function rstr2hex(input){try{hexcase}catch(e){hexcase=0}var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var output="";var x;for(var i=0;i<input.length;i++){x=input.charCodeAt(i);output+=hex_tab.charAt((x>>>4)&0x0F)+hex_tab.charAt(x&0x0F)}return output}function rstr_sha256(s){return binb2rstr(binb_sha256(rstr2binb(s),s.length*8))}function rstr2binb(input){var output=Array(input.length>>2);for(var i=0;i<output.length;i++)output[i]=0;for(var i=0;i<input.length*8;i+=8)output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<(24-i%32);return output}function binb2rstr(input){var output="";for(var i=0;i<input.length*32;i+=8)output+=String.fromCharCode((input[i>>5]>>>(24-i%32))&0xFF);return output}function sha256_S(X,n){return(X>>>n)|(X<<(32-n))}function sha256_R(X,n){return(X>>>n)}function sha256_Ch(x,y,z){return((x&y)^((~x)&z))}function sha256_Maj(x,y,z){return((x&y)^(x&z)^(y&z))}function sha256_Sigma0256(x){return(sha256_S(x,2)^sha256_S(x,13)^sha256_S(x,22))}function sha256_Sigma1256(x){return(sha256_S(x,6)^sha256_S(x,11)^sha256_S(x,25))}function sha256_Gamma0256(x){return(sha256_S(x,7)^sha256_S(x,18)^sha256_R(x,3))}function sha256_Gamma1256(x){return(sha256_S(x,17)^sha256_S(x,19)^sha256_R(x,10))}function sha256_Sigma0512(x){return(sha256_S(x,28)^sha256_S(x,34)^sha256_S(x,39))}function sha256_Sigma1512(x){return(sha256_S(x,14)^sha256_S(x,18)^sha256_S(x,41))}function sha256_Gamma0512(x){return(sha256_S(x,1)^sha256_S(x,8)^sha256_R(x,7))}function sha256_Gamma1512(x){return(sha256_S(x,19)^sha256_S(x,61)^sha256_R(x,6))}var sha256_K=new Array(1116352408,1899447441,-1245643825,-373957723,961987163,1508970993,-1841331548,-1424204075,-670586216,310598401,607225278,1426881987,1925078388,-2132889090,-1680079193,-1046744716,-459576895,-272742522,264347078,604807628,770255983,1249150122,1555081692,1996064986,-1740746414,-1473132947,-1341970488,-1084653625,-958395405,-710438585,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,-2117940946,-1838011259,-1564481375,-1474664885,-1035236496,-949202525,-778901479,-694614492,-200395387,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,-2067236844,-1933114872,-1866530822,-1538233109,-1090935817,-965641998);function binb_sha256(m,l){var HASH=new Array(1779033703,-1150833019,1013904242,-1521486534,1359893119,-1694144372,528734635,1541459225);var W=new Array(64);var a,b,c,d,e,f,g,h;var i,j,T1,T2;m[l>>5]|=0x80<<(24-l%32);m[((l+64>>9)<<4)+15]=l;for(i=0;i<m.length;i+=16){a=HASH[0];b=HASH[1];c=HASH[2];d=HASH[3];e=HASH[4];f=HASH[5];g=HASH[6];h=HASH[7];for(j=0;j<64;j++){if(j<16)W[j]=m[j+i];else W[j]=safe_add(safe_add(safe_add(sha256_Gamma1256(W[j-2]),W[j-7]),sha256_Gamma0256(W[j-15])),W[j-16]);T1=safe_add(safe_add(safe_add(safe_add(h,sha256_Sigma1256(e)),sha256_Ch(e,f,g)),sha256_K[j]),W[j]);T2=safe_add(sha256_Sigma0256(a),sha256_Maj(a,b,c));h=g;g=f;f=e;e=safe_add(d,T1);d=c;c=b;b=a;a=safe_add(T1,T2)}HASH[0]=safe_add(a,HASH[0]);HASH[1]=safe_add(b,HASH[1]);HASH[2]=safe_add(c,HASH[2]);HASH[3]=safe_add(d,HASH[3]);HASH[4]=safe_add(e,HASH[4]);HASH[5]=safe_add(f,HASH[5]);HASH[6]=safe_add(g,HASH[6]);HASH[7]=safe_add(h,HASH[7])}return HASH}function safe_add(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF)}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function rstr_md5(a){return binl2rstr(binl_md5(rstr2binl(a),a.length*8))}function bit_rol(a,b){return a<<b|a>>>32-b}function safe_add(a,b){var c=(a&65535)+(b&65535);var d=(a>>16)+(b>>16)+(c>>16);return d<<16|c&65535}function md5_ii(a,b,c,d,e,f,g){return md5_cmn(c^(b|~d),a,b,e,f,g)}function md5_hh(a,b,c,d,e,f,g){return md5_cmn(b^c^d,a,b,e,f,g)}function md5_gg(a,b,c,d,e,f,g){return md5_cmn(b&d|c&~d,a,b,e,f,g)}function md5_ff(a,b,c,d,e,f,g){return md5_cmn(b&c|~b&d,a,b,e,f,g)}function md5_cmn(a,b,c,d,e,f){return safe_add(bit_rol(safe_add(safe_add(b,a),safe_add(d,f)),e),c)}function binl_md5(a,b){a[b>>5]|=128<<b%32;a[(b+64>>>9<<4)+14]=b;var c=1732584193;var d=-271733879;var e=-1732584194;var f=271733878;for(var g=0;g<a.length;g+=16){var h=c;var i=d;var j=e;var k=f;c=md5_ff(c,d,e,f,a[g+0],7,-680876936);f=md5_ff(f,c,d,e,a[g+1],12,-389564586);e=md5_ff(e,f,c,d,a[g+2],17,606105819);d=md5_ff(d,e,f,c,a[g+3],22,-1044525330);c=md5_ff(c,d,e,f,a[g+4],7,-176418897);f=md5_ff(f,c,d,e,a[g+5],12,1200080426);e=md5_ff(e,f,c,d,a[g+6],17,-1473231341);d=md5_ff(d,e,f,c,a[g+7],22,-45705983);c=md5_ff(c,d,e,f,a[g+8],7,1770035416);f=md5_ff(f,c,d,e,a[g+9],12,-1958414417);e=md5_ff(e,f,c,d,a[g+10],17,-42063);d=md5_ff(d,e,f,c,a[g+11],22,-1990404162);c=md5_ff(c,d,e,f,a[g+12],7,1804603682);f=md5_ff(f,c,d,e,a[g+13],12,-40341101);e=md5_ff(e,f,c,d,a[g+14],17,-1502002290);d=md5_ff(d,e,f,c,a[g+15],22,1236535329);c=md5_gg(c,d,e,f,a[g+1],5,-165796510);f=md5_gg(f,c,d,e,a[g+6],9,-1069501632);e=md5_gg(e,f,c,d,a[g+11],14,643717713);d=md5_gg(d,e,f,c,a[g+0],20,-373897302);c=md5_gg(c,d,e,f,a[g+5],5,-701558691);f=md5_gg(f,c,d,e,a[g+10],9,38016083);e=md5_gg(e,f,c,d,a[g+15],14,-660478335);d=md5_gg(d,e,f,c,a[g+4],20,-405537848);c=md5_gg(c,d,e,f,a[g+9],5,568446438);f=md5_gg(f,c,d,e,a[g+14],9,-1019803690);e=md5_gg(e,f,c,d,a[g+3],14,-187363961);d=md5_gg(d,e,f,c,a[g+8],20,1163531501);c=md5_gg(c,d,e,f,a[g+13],5,-1444681467);f=md5_gg(f,c,d,e,a[g+2],9,-51403784);e=md5_gg(e,f,c,d,a[g+7],14,1735328473);d=md5_gg(d,e,f,c,a[g+12],20,-1926607734);c=md5_hh(c,d,e,f,a[g+5],4,-378558);f=md5_hh(f,c,d,e,a[g+8],11,-2022574463);e=md5_hh(e,f,c,d,a[g+11],16,1839030562);d=md5_hh(d,e,f,c,a[g+14],23,-35309556);c=md5_hh(c,d,e,f,a[g+1],4,-1530992060);f=md5_hh(f,c,d,e,a[g+4],11,1272893353);e=md5_hh(e,f,c,d,a[g+7],16,-155497632);d=md5_hh(d,e,f,c,a[g+10],23,-1094730640);c=md5_hh(c,d,e,f,a[g+13],4,681279174);f=md5_hh(f,c,d,e,a[g+0],11,-358537222);e=md5_hh(e,f,c,d,a[g+3],16,-722521979);d=md5_hh(d,e,f,c,a[g+6],23,76029189);c=md5_hh(c,d,e,f,a[g+9],4,-640364487);f=md5_hh(f,c,d,e,a[g+12],11,-421815835);e=md5_hh(e,f,c,d,a[g+15],16,530742520);d=md5_hh(d,e,f,c,a[g+2],23,-995338651);c=md5_ii(c,d,e,f,a[g+0],6,-198630844);f=md5_ii(f,c,d,e,a[g+7],10,1126891415);e=md5_ii(e,f,c,d,a[g+14],15,-1416354905);d=md5_ii(d,e,f,c,a[g+5],21,-57434055);c=md5_ii(c,d,e,f,a[g+12],6,1700485571);f=md5_ii(f,c,d,e,a[g+3],10,-1894986606);e=md5_ii(e,f,c,d,a[g+10],15,-1051523);d=md5_ii(d,e,f,c,a[g+1],21,-2054922799);c=md5_ii(c,d,e,f,a[g+8],6,1873313359);f=md5_ii(f,c,d,e,a[g+15],10,-30611744);e=md5_ii(e,f,c,d,a[g+6],15,-1560198380);d=md5_ii(d,e,f,c,a[g+13],21,1309151649);c=md5_ii(c,d,e,f,a[g+4],6,-145523070);f=md5_ii(f,c,d,e,a[g+11],10,-1120210379);e=md5_ii(e,f,c,d,a[g+2],15,718787259);d=md5_ii(d,e,f,c,a[g+9],21,-343485551);c=safe_add(c,h);d=safe_add(d,i);e=safe_add(e,j);f=safe_add(f,k)}return Array(c,d,e,f)}function binl2rstr(a){var b="";for(var c=0;c<a.length*32;c+=8)b+=String.fromCharCode(a[c>>5]>>>c%32&255);return b}function rstr2binl(a){var b=Array(a.length>>2);for(var c=0;c<b.length;c++)b[c]=0;for(var c=0;c<a.length*8;c+=8)b[c>>5]|=(a.charCodeAt(c/8)&255)<<c%32;return b}function hex2rstr(a){var b="";for(var c=0;c<a.length;c=c+2){b+=String.fromCharCode(parseInt(a.slice(c,c+2),16))}return b}function rstr2hex(a){var b="0123456789ABCDEF";var c="";var d;for(var e=0;e<a.length;e++){d=a.charCodeAt(e);c+=b.charAt(d>>>4&15)+b.charAt(d&15)}return c}

// Hash an array of multiple 32-bit words to a single word.
// Adapted from "lookup3.c, by Bob Jenkins, May 2006, Public Domain."
// as retrieved 2010-07-03 from http://burtleburtle.net/bob/c/lookup3.c
function hashWord(a,b){function c(a,b){return a<<b|a>>>32-b}var d,e,f,g=a.length,h=0;d=e=f=3735928559+(g<<2)+b|0;while(g>3){d=d+a[h]|0;e=e+a[h+1]|0;f=f+a[h+2]|0;d=d-f|0;d^=c(f,4);f=f+e|0;e=e-d|0;e^=c(d,6);d=d+f|0;f=f-e|0;f^=c(e,8);e=e+d|0;d=d-f|0;d^=c(f,16);f=f+e|0;e=e-d|0;e^=c(d,19);d=d+f|0;f=f-e|0;f^=c(e,4);e=e+d|0;g-=3;h+=3}switch(g){case 3:f=f+a[h+2]|0;case 2:e=e+a[h+1]|0;case 1:d=d+a[h]|0;f^=e;f=f-c(e,14)|0;d^=f;d=d-c(f,11)|0;e^=d;e=e-c(d,25)|0;f^=e;f=f-c(e,16)|0;d^=f;d=d-c(f,4)|0;e^=d;e=e-c(d,14)|0;f^=e;f=f-c(e,24)|0;case 0:break}return f}