var http = require('http');
var urlencode = require('urlencode');
var request = require('request');
const logger = require('../config/logger');

function loginMessage (phNumber,otpNumber,depName,channelName) {
	
	console.log( "inside sms code");
	if (channelName =='app'){
        var msg = urlencode('Dear '+depName+', '+otpNumber+' is your OTP for TNPFIDCL Mobile app login and valid for 5 minutes. Keep the OTP confidential-TNPFIDC');	
    } else {
        var msg = urlencode('Dear '+depName+', OTP for login is '+otpNumber+'. Its validity expires in 5 minutes and keep it confidential.-TNPFIDC');
    }
    /*if (channelName =='app'){
        var msg = urlencode('Dear '+depName+', '+otpNumber+' is your OTP for TNPFCL Mobile App login and valid till 5 minutes. Do not share this OTP to anyone for security reasons.-Tamil Nadu Power Finance (TNPF)');	
    } else {
        var msg = urlencode('Dear '+depName+', '+otpNumber+' is your OTP for TNPFCL Webportal login and valid till 5 minutes. Do not share this OTP to anyone for security reasons.-Tamil Nadu Power Finance (TNPF)');
    }*/
	var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+phNumber+'&text='+msg+'&route=6';
    var options = {
		host: '182.18.143.11',
		path: '/api/mt/SendSMS?'+data
    };
    callback = function(response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            console.log(str);
        });
    }
     
    http.request(options, callback).end();
    }                

module.exports = loginMessage;