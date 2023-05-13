var http = require('http');
var urlencode = require('urlencode');
var request = require('request');
var {username,hash,sender,responseMessage,sucessCode,resourceNotFoundcode,badRequestcode} = require('../config/env');


function serviceMessage (depName,phNumber,service,ackId) {  
	var acklast7Digits = ackId.substr(3,8);
	console.log("acklast7Digits=="+acklast7Digits);
	var msg1 = urlencode('Dear '+depName+', Your Service Request No:ACK'+acklast7Digits+' for '+service+' has been successfully processed. -TNPFIDC');
    var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+phNumber+'&text='+msg1+'&route=6';
	//var data1 = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phNumber + '&message=' + msg1;
	request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {});
    //request.get("https://api.textlocal.in/send?"+ data1, (error, response, body) => {});
}                

module.exports = serviceMessage;

