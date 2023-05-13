var http = require('http');
var urlencode = require('urlencode');
var request = require('request');


function phoneVerificationMessage (phNumber,otpNumber) { 
    
                var msg = urlencode('Dear Depositor, OTP for login is '+otpNumber+'. Its validity expires in 5 minutes and keep it confidential.-TNPFIDC'); 
                //var msg = urlencode('Dear Depositor, '+otpNumber+' is the OTP for your mobile number registration at TNPFCL. Please do not disclose it to anyone and its validity expires in 5 minutes.');
				console.log('inside verification sms');
                var toNumber = phNumber;
                //var username = 'Pallavim@amiainfotech.com';
				/*var username = 'Pallavim@amiainfotech.com';
                var hash = '968e4acc0bc24f5308b1f5e0d2d05a1511cee5a2d03f26ec70dc90b930b53673';
                var sender = 'TNPFCL';
                var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;
				--commented on dec 23 for new sms vendor task*/
				var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+toNumber+'&text='+msg+'&route=6';
                request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {
				//request.get("https://api.textlocal.in/send?"+ data, (error, response, body) => {
                console.log(response.body);
                });
        }                

module.exports = phoneVerificationMessage;