const db = require('../config/db.js');
const sequelize = require('sequelize');
var http = require('http');
var urlencode = require('urlencode');
const MaskData = require('maskdata');
var logger = require('../config/logger');
var request = require('request');
var ootp = db.otpgeneration;
var {
    username,
    hash,
    sender,
    responseMessage,
    sucessCode,
    resourceNotFoundcode,
    badRequestcode
} = require('../config/env.js');


exports.authenticationOtp = (req,res) =>{
    var {
        depositorName,
        phoneNumber,
        purpose
    } = req.body;

    logger.info(`
        ${res.StatusCode} || 
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
	console.log ("inside authentication otp function");	
	depositorName = depositorName.length>16? depositorName.substring(0,16):depositorName;
    if(depositorName && phoneNumber && purpose == 'authentication') {		
        var otp = Math.floor(100000 + Math.random()*900000);
        ootp.build({ PHONE_NUMBER: phoneNumber, OTP: otp, CREATED_DATE: new Date()}).save().then(anotherTask => {
            var msg = urlencode('Dear '+depositorName+', OTP for service request is '+otp+'. Its validity expires in 5 minutes and keep it confidential.-TNPFIDC');
			console.log('msg====='+msg);
            //var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
			var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+phoneNumber+'&text='+msg+'&route=6';
            //request("https://api.textlocal.in/send?"+ data, (error, response, body) => {
			request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {	
				console.log("#$#$ from sendsms sms error:"+ error);
				//console.log("#$#$ from sendsms sms response:"+ response);
				console.log("#$#$ from sendsms sms body:"+ JSON.stringify(response.body));
				console.log('statusCode 2:', response.body.ErrorCode);
				let resp = JSON.parse(response.body);
				if(resp && resp.ErrorCode == '000'){
					var last4Digits = phoneNumber.slice(-4);
					var mask = last4Digits.padStart(phoneNumber.length, '*');
					return res.status(200).send({
						"responseCode":sucessCode,
						"response":"Your OTP has been sent to your Registered Mobile" +' '+ mask
					});

				} else {
					return res.status(200).send({
						"responseCode":resp.ErrorCode,
						//"responseMessage":resp.errors[0].message,
						"response":resp.ErrorMessage,
					});
				}  
			});
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });

    } else if (depositorName && phoneNumber && purpose == 'download') {
        
        var d = new Date();
        var date = d.toLocaleString
        /*var msg = urlencode('Dear '+depositorName+', You have successfully downloaded your fixed deposit confirmation receipt on '+ date +' - Tamil Nadu Power Finance (TNPF)');
		console.log ("inside sms block "+msg);
        /*var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
        request("https://api.textlocal.in/send?"+ data, (error, response, body) => {}); - done on dec 16 tnpfc 2211*/
        return res.status(200).send({
            "responseCode":sucessCode,
            "response":"Certificate Download message will be sent to your mobile number"
        });
    } else {
        return res.status(200).send({
            "responseCode":badRequestcode,
            "response":responseMessage
        });
    }
}