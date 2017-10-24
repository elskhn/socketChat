/* global Crypt, CryptoJS*/
Crypt = function(passphrase) {
    "use strict";
    var pass = passphrase;
    var CryptoJSAesJson = {
        parse: function(jsonStr) {
            var j = JSON.parse(jsonStr);
            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(j.ct)
            });
            if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
            if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
            return cipherParams;
        },
        stringify: function(cipherParams) {
            var j = {
                ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
            };
            if (cipherParams.iv) j.iv = cipherParams.iv.toString();
            if (cipherParams.salt) j.s = cipherParams.salt.toString();
            return JSON.stringify(j);
        }
    };

    return {
        decrypt: function(data) {
            return JSON.parse(CryptoJS.AES.decrypt(data, pass, {
                format: CryptoJSAesJson
            }).toString(CryptoJS.enc.Utf8));
        },
        encrypt: function(data) {
            return CryptoJS.AES.encrypt(JSON.stringify(data), pass, {
                format: CryptoJSAesJson
            }).toString();
        }
    };
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    CryptoJS = require("crypto-js");
    module.exports = Crypt;
} else {
    window.Crypt = Crypt;
}