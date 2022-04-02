var http = require('http');
var urlencode = require('urlencode');
var request = require('request');


function phoneVerificationMessage (phNumber,otpNumber) { 
    
                var msg = urlencode('Dear Depositor, '+otpNumber+' is the OTP for new deposit details confirmation by TNPFCL. Please do not disclose it to anyone and its validity expires in 5 minutes.'); 
                //var msg = urlencode('Dear Depositor, '+otpNumber+' is the OTP for your mobile number registration at TNPFCL. Please do not disclose it to anyone and its validity expires in 5 minutes.');
                var toNumber = phNumber;
                var username = 'Pallavim@amiainfotech.com';
                var hash = '968e4acc0bc24f5308b1f5e0d2d05a1511cee5a2d03f26ec70dc90b930b53673';
                var sender = 'TNPFCL';
                var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;

                request.get("https://api.textlocal.in/send?"+ data, (error, response, body) => {
                //console.log(response.body);
                })
        }                

module.exports = phoneVerificationMessage;