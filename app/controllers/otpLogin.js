const db = require('../config/db.js');
const sequelize = require('sequelize');
var ootp = db.otpgeneration;
var http = require('http');
var logger = require('../config/logger');
var urlencode = require('urlencode');
const MaskData = require('maskdata');
var request = require('request');
var {username,hash,sender,responseMessage,sucessCode,resourceNotFoundcode,badRequestcode} = require('../config/env');


exports.logincreation = (req,res,err) => {
    var panNumber = req.body.panNumber;
    var channel = req.body.channel; //app // web
    panNumber = panNumber.toUpperCase();

	//for ios app testing - inserted on 23 june 2021 by karthi
	if(panNumber == 'DEMOU1234R' && (channel == 'app' || channel == 'ios' || channel == 'android')){
    
	var otp = 987654;
	
	ootp.build({ CUST_ID: 'C011000368', // change which ever customerid you want
				PHONE_NUMBER:'9113898212', // change which ever phone number you want
				OTP: otp, 
				CREATED_DATE: new Date(), 
                PAN_NUMBER: 'DEMOU1234R' // same also pan number
	}).save().then(anotherTask => {
		return res.status(200).send({
			"responseCode":200,
			"response":"Enter OTP 987654 in the OTP field." 
		});
                           
    }).catch(err => { res.status(500).send({ message: err.message});});
    
	}
	else {
    if(panNumber && channel){
            var query = 'select decode (cust_type,\'INDIVIDUAL\',fname,comp_name) as "FNAME",cp.phone_number, c.cust_id, c.email_id from customer c left join cust_phone cp on c.cust_id = cp.cust_id and phone_type_id = \'MOBILE\' where (pan_number =:panNumber or tan_no =:panNumber) AND NOT EXISTS(SELECT * FROM CUSTOMER_SUSPENDED CS WHERE C.CUST_ID = CS.CUST_ID and cs.status=\'SUSPENDED\') AND C.AUTHORIZE_STATUS = \'AUTHORIZED\' AND (CUSTOMER_STATUS !=\'DECEASED\' OR CUSTOMER_STATUS IS NULL)';
            db.sequelize.query(query,{replacements:{panNumber:panNumber},type:sequelize.QueryTypes.SELECT}
            ).then(results => {
				console.log("results==========="+ JSON.stringify(results));
                if(results.length > 0){
                    logger.info("results==========="+ JSON.stringify(results));
                    var customerId = results[0].CUST_ID;
                    var fName = results[0].FNAME;
                    var phoneNumber = results[0].PHONE_NUMBER;
					var email = results[0].EMAIL_ID;
                    if(phoneNumber == null){
                        return res.status(200).send({
                            "responseCode":resourceNotFoundcode,
                            "response":"No Phone Number Mapped to this PAN. Contact customersupport@tnpowerfinance.com"
                        });
                    } else if (customerId == null){
                        return res.status(200).send({
                            "responseCode":resourceNotFoundcode,
                            "response":"No CustomerId Mapped to this PAN. Contact customersupport@tnpowerfinance.com"
                        });
                    } else if(fName == null){
                        return res.status(200).send({
                            "responseCode":resourceNotFoundcode,
                            "response":"No Customer Name found for this PAN. Contact customersupport@tnpowerfinance.com"
                        });
                    }
                    var firstName = results[0].FNAME.length>16? results[0].FNAME.substring(0,16):results[0].FNAME;
                    var otp = Math.floor(100000 + Math.random()*900000);
                    console.log("OTP"+otp);
                    ootp.build({ CUST_ID: customerId, PHONE_NUMBER: phoneNumber, OTP: otp, CREATED_DATE: new Date(),PAN_NUMBER: panNumber}
                    ).save().then(anotherTask => {
						console.log(phoneNumber);
						if (channel =='app'){
						var msg = urlencode('Dear '+firstName+', '+otp+' is your OTP for TNPFCL Mobile App login and valid till 5 minutes. Do not share this OTP to anyone for security reasons.');	
						} else {
							var msg = urlencode('Dear '+firstName+', '+otp+' is your OTP for TNPFCL Webportal login and valid till 5 minutes. Do not share this OTP to anyone for security reasons.');
						} 
						var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
						//require('../middleware/sendingSms.js')(phoneNumber,otp,firstName,channel);
						request("https://api.textlocal.in/send?"+ data, (error, response, body) => {});
						if(email){
							require('../middleware/sendotp2Mail.js')(otp,email,channel,firstName);
						}
                        
                        const last4Digits = phoneNumber.slice(-4);
                        const mask= last4Digits.padStart(phoneNumber.length, '*');
                        return res.status(200).send({
                            "responseCode":sucessCode,
                            "response":"Your OTP has been sent to your Registered Mobile" +' '+ mask
                        });
                    }).catch(err => {
                        logger.error(err); 
                        res.status(500).send({
                            data:null,
                            message: err.message
                        });
                    });
                } else {
                    return res.status(200).send({
                        "responseCode":resourceNotFoundcode,
                        "response":"Invalid PAN Number. Contact customersupport@tnpowerfinance.com"
                    });
                }
            }).catch(err => {
                logger.error(err);
                res.status(500).send({
                    data:null,
                    message: err.message
                });
            });
    } else {
            return res.status(200).send({
                "responseCode":badRequestcode,
                "response":responseMessage
            });
    }
	}
}  