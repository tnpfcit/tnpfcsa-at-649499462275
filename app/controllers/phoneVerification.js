const db = require('../config/db.js');
const sequelize = require('sequelize');
const logger = require('../config/logger');
var ootp = db.otpgeneration;

exports.phoneRegister = (req,res) => {
    var phoneNumber = req.body.phoneNumber;

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);
        
        if(phoneNumber){
            var otp = Math.floor(100000 + Math.random()*900000);
           
            ootp.build({
                PHONE_NUMBER: phoneNumber, 
                OTP: otp, 
                CREATED_DATE: new Date()}
            ).save().then(anotherTask => {

                require('../middleware/phoneVerification.js')(phoneNumber,otp);
                const last4Digits = phoneNumber.slice(-4);
                const mask= last4Digits.padStart(phoneNumber.length, '*');

                return res.status(200).send({
                    "responseCode":"200",
                    "response":"Your OTP has been sent to your Registered Mobile" +' '+ mask
                });

            }).catch(err => {
                res.status(500).send({
                    data:null,
                    message: err.message
                });
            });
        } else {
            return res.status(200).send({
                "response":"Invalid input parameters check key value pair in request body"
            });
        }
}
