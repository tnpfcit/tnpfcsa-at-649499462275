var http = require('http');
var urlencode = require('urlencode');
var request = require('request');
const logger = require('../config/logger');

function loginMessage (phNumber,otpNumber,depName,channelName) {

    var apikey = 'fKg1OFur8W0-o5BZOYix5QH819nWmckJyUIfCoqobz';
    
    if (channelName =='app'){
        var msg = urlencode('Dear '+depName+', '+otpNumber+' is your OTP for TNPFCL Mobile App login and valid till 5 minutes. Do not share this OTP to anyone for security reasons.');	
    } else {
        var msg = urlencode('Dear '+depName+', '+otpNumber+' is your OTP for TNPFCL Webportal login and valid till 5 minutes. Do not share this OTP to anyone for security reasons.');
    }   
    
    
    var sender='TNPFCL';
    var data='apikey='+apikey+'&sender='+sender+'&numbers='+phNumber+'&message='+msg
    var options = {
                    host: 'api.textlocal.in',
                    path: '/send?'+data
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