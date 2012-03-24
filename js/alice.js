zzvar aliceRegex = /^\d\d\d\d\d\d\d\d$/;
var ALIS = "64C6DDE3E579B6D986968D3445D23B15CAAF128402AC560005CE2075913FDCE8";
var preInitCharset = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                       'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                       'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                       'u', 'v', 'w', 'x', 'y', 'z' ];
                       
function alice(input) {
    if (!(typeof(input) == 'string')) { return false; }
    if (input.slice(0, 6) == 'Alice-') { input = input.slice(6); }
    if (!aliceRegex.test(input)) { return false; }
    return alice_wpa(input);
}

function alice_wpa(ssid) {
    var result = new Array();
    var serie = ssid.slice(0, 3);
    if (!Object.prototype.hasOwnProperty.call(config, serie)) { return ''; }
    var magic = config[serie];
    for (m=0; m<magic.length; m++) {
        ssid_num = parseInt(ssid, 10);
        sn1 = magic[m][0];
        if (sn1.slice(-1) == '1' || sn1.slice(-1) == '2') { k = 13; }
        else { k = 8; }
        q = magic[m][1];
        oui = parseInt(magic[m][2], 16);
        
        if ((ssid_num-q) % k != 0 || (ssid_num-q)/k > 9999999) {
            continue;
        }
        var quot = ((ssid_num-q)/k).toString();
        quot = pad(quot, 7);
        var sn = sn1 + 'X' + quot;
        //console.log(sn);
        
        for (var i = 0; i<3; i++) {
            var mac = ssid_num + ( i * 100000000 );
            if (Math.floor((mac/0x1000000%0x10)) == (oui%0x10)) {
                mac = mac % 0x1000000 + oui * 0x1000000;
                mac = mac.toString(16);
                mac = pad(mac, 12);
                //console.log(mac);
                
                var pack = hex2rstr(ALIS);
                pack += sn;
                pack += hex2rstr(mac);
                
                var sha = rstr_sha256(pack);
                
                var wpa = '';
                for (var x = 0; x<24; x++) {
                    wpa += preInitCharset[sha.charCodeAt(x)%36];
                }
                
                result.push(wpa);
            } else {
                continue;
            }
        }
    }
    return result.join('$');
}

function alice_test() {
    var result = 'OK';
    var problems = new Array();
    var test_cases = [ [ '96140044', '3neykd9j73tr815a7pkis3xk' ],
                       [ 'Alice-96140044', '3neykd9j73tr815a7pkis3xk' ],
                       [ 96140044, false ],
                       [ '9614004', false ],
                       [ '961400445', false ],
                       [ 'Alice-961400445', false ],
                       [ '96140045', '' ],
                       [ '12345678', '' ],
                       [ '47897826', '' ],
                       [ '45100003', 'tyn4a3r7z478nts6rleh3jlk' ],
                       [ '44900011', 'atud1bpc7zxtirhxdtcddotb$ukpxasd3zdojorwyl98rp5wo' ] ];
    for (var i=0; i < test_cases.length; i++) {
        if (alice(test_cases[i][0]) != test_cases[i][1]) {
            result = 'FAIL ';
            problems.push(test_cases[i][0]);
        
        }   
    }
    return result + problems.join(' ');
}
