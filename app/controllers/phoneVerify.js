const db = require('../config/db.js');
const sequelize = require('sequelize');
var jwt = require('jsonwebtoken');
const logger = require('../config/logger');
var ootps = db.otpgeneration;

exports.phoneVerify = (req,res) => {
    var {        
        otp,
        phoneNumber
    } = req.body;
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);
    db.sequelize.query('SELECT TRUNC(difference * 24*60*60) as DIFF FROM ( SELECT sysdate - (select max(created_date) from API_OTPGENERATION where phone_number =:phoneNumber and otp =:otp and pan_number is null and cust_id is null)  AS difference FROM DUAL)',
        {replacements: {
            otp: otp, 
            phoneNumber: phoneNumber
        },type: sequelize.QueryTypes.SELECT}
    ).then(results=>{
        var result = results[0].DIFF;        
        if(result == null){            
            return res.status(200).send({
                "responseCode":404,
                "response":"Invalid OTP"
            });
        } else if (result > 300){
            
            return res.status(200).send({
                "responseCode":404,
                "response": "Otp Time is Expired"
            });

        } else {
            //var secret = "FINCURO_API_TNPFC";
			//var oasys_tokenpart = {"otpp":otp,"phone":phoneNumber,"systemdate":new Date()};
					 
            ootps.update({ STATUS:'CLOSED'},{ where: { PHONE_NUMBER : phoneNumber}}
            ).then(results =>{
                //var authToken = jwt.sign({oasys_tokenpart},secret,{expiresIn:'8h'});      						  
                        
                    return res.status(200).send({
                        "responseCode":200,
                        "message":"OTP is authenticated",
                        "response": "Your Phone number is successfully Verified"
                    });

            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
                     
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
}

 