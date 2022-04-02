const db = require('../config/db.js');
const sequelize = require('sequelize');
var otp_login = db.otplogin;
var otp_phone = db.custphone;
var ootp = db.otpgeneration;
var http = require('http');
var urlencode = require('urlencode');
const MaskData = require('maskdata');
var request = require('request');

exports.phoneRegister = (req,res) => {
    var phoneNumber = req.body.phoneNumber;
        if(phoneNumber){
            var otp = Math.floor(100000 + Math.random()*900000);
            var curr_dt = new Date();
           
            ootp.build({ PHONE_NUMBER: phoneNumber, OTP: otp, CREATED_DATE: curr_dt}).save().then(anotherTask => {
                //require('../middleware/sendingSms.js')(phone,otp,firstName,channel);
                //var mask = require('../middleware/maskPhoneNumber')(phone);
                require('../middleware/phoneVerification.js')(phoneNumber,otp);
                const last4Digits = phoneNumber.slice(-4);
                const mask= last4Digits.padStart(phoneNumber.length, '*');
                return res.status(200).send({"response":"Your OTP has been sent to your Registered Mobile" +' '+ mask});
            }).catch(err => { res.status(500).send({ message: err.message});});
        }
        else{
            return res.status(422).send({"response":"Invalid input parameters check key value pair in request body"});
        }
}
