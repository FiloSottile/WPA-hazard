var telsey_OUI = [ '00036F', '002196' ];
var pirelli_OUI = [ '000827', '0013C8', '0017C2', '00193E', '001CA2', '001D8B', '002233', 
                    '00238E', '002553', '00A02F', '080018', '3039F2', '38229D', '6487D7', '00268D' ];
var macRegex = /^[\dABCDEF][\dABCDEF][\dABCDEF][\dABCDEF][\dABCDEF][\dABCDEF][\dABCDEF][\dABCDEF][\dABCDEF][\dABCDEF][\dABCDEF][\dABCDEF]$/;
                    
function fastweb(input) {
    if (!(typeof(input) == 'string')) { return false; }
    input = input.toUpperCase();
    input = input.replace(/FASTWEB-\d-/g,"");
    input = input.replace(/[-\.:,;]/g,"");
    if (!macRegex.test(input)) { return false; }
    if (telsey_OUI.indexOf(input.slice(0,6)) != -1) { return telsey(input); }
    else if (pirelli_OUI.indexOf(input.slice(0,6)) != -1) { return pirelli(input); }
    else { return ''; }
}

function telsey(mac_string) {

    var mac_bytes = new Array();

    for (i=0; i<6; i++) {
        mac_bytes[i] = parseInt(mac_string.slice(i*2, (i+1)*2), 16);
    }

    var modello = [ [ 6,2,1,6 ], [ 2,1,2,6 ], [ 5,3,4,3 ], [ 5,4,3,3 ], [ 3,5,3,1 ], [ 3,6,4,2 ], [ 1,5,1,2 ], [ 2,5,2,1 ],
                    [ 3,5,3,3 ], [ 4,2,4,5 ], [ 5,2,5,4 ], [ 6,2,6,6 ], [ 3,2,1,6 ], [ 2,1,2,2 ], [ 5,3,2,4 ], [ 4,4,6,3 ],
                    [ 5,5,6,5 ], [ 6,2,5,1 ], [ 3,6,1,6 ], [ 3,2,4,6 ], [ 6,3,3,5 ], [ 3,4,2,5 ], [ 1,5,5,4 ], [ 4,1,6,4 ],
                    [ 5,4,1,1 ], [ 4,3,2,2 ], [ 3,2,3,6 ], [ 2,4,5,4 ], [ 1,3,4,5 ], [ 1,1,3,3 ], [ 1,1,1,6 ], [ 2,2,2,5 ],
                    [ 5,1,3,3 ], [ 4,4,4,1 ], [ 1,3,5,2 ], [ 6,6,6,1 ], [ 1,5,6,1 ], [ 2,2,6,3 ], [ 3,3,6,2 ], [ 4,4,3,4 ],
                    [ 2,1,3,5 ], [ 2,6,3,6 ], [ 1,2,5,1 ], [ 2,2,2,5 ], [ 3,3,3,3 ], [ 4,4,4,4 ], [ 6,5,1,2 ], [ 5,1,6,6 ],
                    [ 2,1,6,1 ], [ 1,2,6,2 ], [ 3,3,5,3 ], [ 4,5,5,4 ], [ 5,4,2,6 ], [ 6,6,2,5 ], [ 4,1,2,6 ], [ 4,2,1,5 ],
                    [ 5,3,3,6 ], [ 5,4,4,2 ], [ 3,5,4,1 ], [ 3,4,6,2 ], [ 4,2,3,4 ], [ 6,1,2,3 ], [ 6,4,5,2 ], [ 1,3,4,1 ]];
                    
    var vettore = new Array(64);

    for (i=0; i<64; i++) {
        vettore[i] = mac_bytes[modello[i][0] - 1] * (0x1000000) + mac_bytes[modello[i][1] - 1] * (0x10000) + 
                     mac_bytes[modello[i][2] - 1] * (0x100)     + mac_bytes[modello[i][3] - 1];
    }

    var hash_vettore = 0;
    for (var x=0; x<64; x++) {
        hash_vettore = hashWord(vettore.slice(0, x), hash_vettore) >>> 0;
    }

    var secondo_vettore = new Array(64);
        
    for (var i=0; i<64; i++) {
        if (i < 8) secondo_vettore[i] = vettore[i] << 3;
        else if (i < 16) secondo_vettore[i] = vettore[i] >>> 5;
        else if (i < 32) secondo_vettore[i] = vettore[i] >>> 2;
        else secondo_vettore[i] = vettore[i] << 7;
    }
        
    var hash_secondo_vettore = 0;
    for (var x=0; x<64; x++) {
        hash_secondo_vettore = hashWord(secondo_vettore.slice(0, x), hash_secondo_vettore) >>> 0;
    }

    return pad(hash_vettore.toString(16), 8).slice(-5) + pad(hash_secondo_vettore.toString(16), 8).slice(0, 5);

};

function pirelli(mac_string) {
    mac_rstr = hex2rstr(mac_string);

    fissa = "223311340281FA22114168111201052271421066";
    fissa_rstr = hex2rstr(fissa);

    rstr = mac_rstr + fissa_rstr;
    md5 = rstr2hex(rstr_md5(rstr));

    var bits = '';
    var out;
    for (i=0; i<4; i++) {
        out = parseInt(md5.slice(i*2, (i+1)*2), 16).toString(2);
        out = pad(out, 8);
        bits += out;
    }


    var blocchi = new Array(5);
    for (var i=0; i<5; i++) {
        blocchi[i] = parseInt(bits.slice(i*5, (i+1)*5), 2);
        if (blocchi[i] >= 0xA) {
            blocchi[i] = blocchi[i] + 0x57;
        }
    }

    var key = '';
    for (var i = 0; i < 5; i++) {
        out = blocchi[i].toString(16);
        out = pad(out, 2);
        key += out;
    }
    
    return key;
}

function fastweb_test() {
    var test_cases = [ [ 'FASTWEB-1-00036F8E42BC', '7fcee0998a' ],
                       [ '00219623EB84', '5b887cb8f5'],
                       [ 'fastWeB-2-00.21-96;Cd:eF:Ab,', '389b64a1dc' ],
                       [ 'FASTWEB-1-00036F8E42B', false ],
                       [ 'FASTWEB-1-00036F8E42BCF', false ],
                       [ 'FASTWEB-1-00036F8E42BX', false ],
                       [ 0x00036F8E42BC, false ],
                       [ 'FASTWEB-1-000D6F8E42BC', '' ],
                       [ '001CA2AAAAAA', '0964080272'],
                       [ 'FASTWEB-1-001CA2CCCCCC', '690268086f'] ];
    var result = 'OK';
    var problems = new Array();
    for (var i=0; i < test_cases.length; i++) {
        if (fastweb(test_cases[i][0]) != test_cases[i][1]) {
            result = 'FAIL ';
            problems.push(test_cases[i][0]);
        
        }   
    }
    return result + problems.join(' ');
}
