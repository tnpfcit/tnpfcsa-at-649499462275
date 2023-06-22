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
        purpose,
		customerId
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
	console.log ("name=="+depositorName+"phonenumber==="+phoneNumber);	

    if(depositorName && phoneNumber && purpose == 'authentication') {
		depositorName = depositorName.length>16? depositorName.substring(0,16):depositorName;	
        console.log("#$#$ PHONE NUMBER sendsms sms :"+ phoneNumber);
        var otp = Math.floor(100000 + Math.random()*900000);
        ootp.build({ PHONE_NUMBER: phoneNumber, OTP: otp, CREATED_DATE: new Date}).save().then(anotherTask => {
            var msg = 'Dear '+depositorName+', OTP for service request is '+otp+'. Its validity expires in 5 minutes and keep it confidential.-TNPFIDC';
			console.log('msg====='+msg);
			let CT_ID ="1007283030010780187";
			let PE_ID="1201161518408588786"; // Principal Entity ID // no need to change
			let TM_ID="1001096933494158";  // Static ID -- No Need to change
			let OA="TNPFFD"; // // office header no need to change
			let username ="tnega_pfidc2"; // username
			let smsServerUrl = "https://digimate.airtel.in:15443/BULK_API/InstantJsonPush";
			//http://digimate.airtel.in:15181/BULK_API/InstantJsonPush
			
			let json_string = "{\"keyword\":\"DEMO\",\"timeStamp\":\"071818163530\",\"dataSet\":[{\"UNIQUE_ID\":\"735694wew\",\"MESSAGE\":\""+msg+"\",\"OA\":\""+OA+"\",\"MSISDN\":\""+phoneNumber+"\",\"CHANNEL\":\"SMS\",\"CAMPAIGN_NAME\":\"tnega_u\",\"CIRCLE_NAME\":\"DLT_SERVICE_IMPLICT\",\"USER_NAME\":\""+username+"\",\"DLT_TM_ID\":\""+TM_ID+"\",\"DLT_CT_ID\":\""+CT_ID+"\",\"DLT_PE_ID\":\""+PE_ID+"\",\"LANG_ID\":\"0\"}]}";
			let jsonObj = JSON.parse(json_string);
			console.log("Final JSON String :"+JSON.stringify(jsonObj));
			//var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+phoneNumber+'&text='+msg+'&route=6';
			//request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error1, response1, body1) => {});
			var  query = 'SELECT email_id as email_id,nvl(fname,comp_name) name from customer where cust_id=:customerId';
			db.sequelize.query(query,{
				replacements:{
					customerId:customerId
				},type:sequelize.QueryTypes.SELECT}
			).then(results => {
				console.log ("results ======="+JSON.stringify(results));
				let email = results[0].EMAIL_ID;
				let fName = results[0].NAME;
				let echannel = 'serviceReq';
				require('../middleware/sendotp2Mail.js')(otp,email,echannel,fName); 
			}).catch(err => {
				logger.error(err);
				res.status(500).send({
					data:null,
					message: err.message
				});
			});
			request({
				url:smsServerUrl,
				method: "POST",
				json:true,
				body:jsonObj
			}, function(error,response,body){
				console.log("3333 error:"+error);
				let resp = JSON.parse(response.body);
				if(resp===true){
					var last4Digits = phoneNumber.slice(-4);
					var mask = last4Digits.padStart(phoneNumber.length, '*');
					return res.status(200).send({
						"responseCode":sucessCode,
						"response":"Your OTP has been sent to your Registered Mobile" +' '+ mask
					});
				} else {
					return res.status(200).send({
						"responseCode":'',
						//"responseMessage":resp.errors[0].message,
						"response":'Error in sending OTP message',
					});
				}
			});
			
            //var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
			//var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+phoneNumber+'&text='+msg+'&route=6';
            /*request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {	
			let resp = JSON.parse(response.body);
			if(resp && resp.body == 'true'){
				var last4Digits = phoneNumber.slice(-4);
				var mask = last4Digits.padStart(phoneNumber.length, '*');
				return res.status(200).send({
					"responseCode":sucessCode,
					"response":"Your OTP has been sent to your Registered Mobile" +' '+ mask
				});

			} else {
				return res.status(200).send({
					"responseCode":resp.errors[0].code,
					//"responseMessage":resp.errors[0].message,
					"response":resp.errors[0].message,
				});
			}  
		});*/
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