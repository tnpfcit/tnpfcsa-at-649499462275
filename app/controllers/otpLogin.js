const db = require('../config/db.js');
const sequelize = require('sequelize');
var ootp = db.otpgeneration;
var http = require('http');
var logger = require('../config/logger');
var urlencode = require('urlencode');
const MaskData = require('maskdata');
var request = require('request');
var {
    
    username,
    hash,
    sender,
    responseMessage,
    sucessCode,
    resourceNotFoundcode,
    badRequestcode

} = require('../config/env');

exports.logincreation = (req,res,err) => {
    
    var {
        panNumber,
        channel
    } = req.body;

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);

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
	// ios testing code ends here
		if(panNumber && channel){
			
			var query = 'select * from api_otpgeneration where status is null and pan_number =:panNumber';
			
			db.sequelize.query(query,{replacements:{panNumber:panNumber},type:sequelize.QueryTypes.SELECT}
			).then(results => {
				if(results.length > 0){
					ootp.update({ STATUS:'CLOSED'},{where:{PAN_NUMBER : panNumber}}).then(results =>{ 
					}).catch(err => {
						return res.status(500).send({
							data:null,
							message: err.message
						});
					});
				}
			}).catch(err =>{
				return res.status(500).send({
					data:null,
					message: err.message
				});
			});
		}	
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
					
						ootp.build({ CUST_ID: customerId, PHONE_NUMBER: phoneNumber, OTP: otp, CREATED_DATE: new Date(),PAN_NUMBER: panNumber}
						).save().then(anotherTask => {
							console.log('phoneNumber='+phoneNumber+' otp='+otp);
							require('../middleware/sendingSms.js')(phoneNumber,otp,firstName,channel);
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


exports.sendsms = (req,res,err) => {
    
    var {
        apikey,
		sender,
		message,
		numbers,
		smsId
    } = req.body;
	
	message = urlencode(message);
	var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+numbers+'&text='+message+'&route=6';

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);
	console.log("#$#$ from sendsms data:"+ data);
	console.log("#$#$ from sendsms data2:"+ JSON.stringify(req.body));
	request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {
	console.log("#$#$ from sendsms sms body:"+ JSON.stringify(response.body));
	console.log('statusCode 2:', response.body.ErrorCode);
	/*if (response.statusCode == 502) {
		return res.status(200).send({
			"responseCode":502,
			"responseMessage":'Bad Gateway',
			"response":'Undelivered'
		});
	} else {*/ // commented when moved to the new vendor on dec 23 2022
		var resp = JSON.parse(response.body);
		console.log("#$#$ from sendsms response status : "+resp.ErrorCode);
		if(resp && resp.ErrorCode == '000'){
			var sms_status = 'DELIVERD';
		}else {
			var sms_status = 'UNDELIVERD';
		};
		var smsrespmsg = resp.ErrorMessage.substring(0,256);
		var query = 'update sms_acknowledgment set acknowledgment=:status,response_msg=:msg where sms_id =:smsId and phone_no = :phoneno and acknowledgment=\'INITIATED\' and response_msg is NULL';							
		db.sequelize.query(query,{
			replacements:{
				status:sms_status,msg:smsrespmsg,smsId:smsId,phoneno:numbers
			},type:sequelize.QueryTypes.UPDATE}
		).then(results => {
			logger.info('sms response body===' ||JSON.stringify(response.body));
			if(resp && resp.ErrorCode == '000'){
			return res.status(200).send({
				"response":'success',
				"responseCode":'200'
			});
			} else {
				return res.status(200).send({
					"responseCode":resp.ErrorCode,
					"responseMessage":resp.ErrorMessage,
					"response":resp.ErrorMessage
				});
			}	
		}).catch(err => {
			logger.error(err);
			res.status(500).send({
				data:null,
				message: err.message
			});
		});	
	//}	// commented when moved to the new vendor on dec 23 2022
	})
}

//commented to update the sms status here in api layer than in fms 
/*exports.sendsms = (req,res,err) => {
    
    var {
        apikey,
		sender,
		message,
		numbers
    } = req.body;
	
	message = urlencode(message);
	var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+numbers+'&text='+message+'&route=6';

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);
	console.log("#$#$ from sendsms data:"+ data);
	console.log("#$#$ from sendsms data2:"+ JSON.stringify(req.body));
	request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {
	console.log("#$#$ from sendsms sms body:"+ JSON.stringify(response.body));
	console.log('statusCode 2:', response.body.ErrorCode);
	/*if (response.statusCode == 502) {
		return res.status(200).send({
			"responseCode":502,
			"responseMessage":'Bad Gateway',
			"response":'Undelivered'
		});
	} else { // commented when moved to the new vendor on dec 23 2022
		var resp = JSON.parse(response.body);
		console.log("#$#$ from sendsms response status : "+resp.ErrorCode);
		if(resp && resp.ErrorCode == '000'){
			return res.status(200).send({
				"response":'success',
				"responseCode":'200'
			});
		} else {
			return res.status(200).send({
				"responseCode":resp.ErrorCode,
				"responseMessage":resp.ErrorMessage,
				"response":resp.ErrorMessage
			});
		}
	//}	// commented when moved to the new vendor on dec 23 2022
	})
}*/