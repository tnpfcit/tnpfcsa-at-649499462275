var http = require('http');
var urlencode = require('urlencode');
var request = require('request');
var {username,hash,sender,responseMessage,sucessCode,resourceNotFoundcode,badRequestcode} = require('../config/env');


function serviceMessage (depName,phNumber,service,ackId) {  

   // var msg = urlencode('Dear '+depName+', Your Service Request No. '+ackId+' for '+service+' has been received by TN Power Finance for processing');
    var msg1 = urlencode('Dear '+depName+', Your Service Request No: '+ackId+' for '+service+' has been successfully processed by TN Power Finance.');
   // var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phNumber + '&message=' + msg;
    var data1 = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phNumber + '&message=' + msg1;
   // request.get("http://api.textlocal.in/send?"+ data, (error, response, body) => {});
    request.get("http://api.textlocal.in/send?"+ data1, (error, response, body) => {});
}                
module.exports = serviceMessage;

