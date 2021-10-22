const db = require('../config/db.js');
const sequelize = require('sequelize');
var http = require('http');
var urlencode = require('urlencode');
const MaskData = require('maskdata');
var request = require('request');
var ootp = db.otpgeneration;
var {username,hash,sender,responseMessage} = require('../config/env.js');


exports.authenticationOtp = (req,res) =>{
    var {depositorName,phoneNumber,purpose} = req.body;
    depositorName = depositorName.length>16? depositorName.substring(0,16):depositorName;
    console.log(depositorName);
        if(depositorName && phoneNumber && purpose == 'authentication') {
            var otp = Math.floor(100000 + Math.random()*900000);
            var curr_dt = new Date();
            ootp.build({ PHONE_NUMBER: phoneNumber, OTP: otp, CREATED_DATE: curr_dt}).save().then(anotherTask => {
                var msg = urlencode('Dear '+depositorName+', '+otp+' is the OTP for service request at TNPFCL. Please do not disclose it to anyone and its validity expires in 5 minutes.');
                var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
                request("http://api.textlocal.in/send?"+ data, (error, response, body) => {});
                var last4Digits = phoneNumber.slice(-4);
                var mask= last4Digits.padStart(phoneNumber.length, '*');
                return res.status(200).send({"responseCode":200,"response":"Your OTP has been sent to your Registered Mobile" +' '+ mask});
            }).catch(err => { res.status(500).send({ message: err.message});});
        } else if (depositorName && phoneNumber && purpose == 'download') {
            var d = new Date();
            var date = d.toLocaleString();
            var msg = urlencode('Dear '+depositorName+', You have successfully downloaded your fixed deposit confirmation receipt on '+ date);
            var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
            request("http://api.textlocal.in/send?"+ data, (error, response, body) => {});
            return res.status(200).send({"responseCode":200,"response":"Certificate Download message will be sent to your mobile number"});
        } else {
            return res.status(400).send({"responseCode":400,"response":responseMessage});
        }
}