var http = require('http');
var urlencode = require('urlencode');
var request = require('request');
const logger = require('../config/logger');

function loginMessage (phNumber,otpNumber,depName,channelName) {
	
	console.log( "inside sms code");
	let CT_ID="";
    if (channelName =='app'){
        var msg = 'Dear '+depName+', '+otpNumber+' is your OTP for TNPFIDCL Mobile app login and valid for 5 minutes. Keep the OTP confidential-TNPFIDC';
		CT_ID="1007075777651485395";	
    } else {
//        var msg = urlencode('Dear '+depName+', OTP for login is '+otpNumber+'. Its validity expires in 5 minutes and keep it confidential.-TNPFIDC');
        var msg = 'Dear '+depName+', OTP for login is '+otpNumber+'. Its validity expires in 5 minutes and keep it confidential.-TNPFIDC';
		CT_ID="1007221976050210796";	
		//var msg = 'Dear '+depName+', '+otpNumber+' is your OTP for TNPFIDCL Mobile app login and valid for 5 minutes. Keep the OTP confidential-TNPFIDC';
    }
	
	console.log("phoneno"+phNumber);
	let PE_ID="1201161518408588786"; // Principal Entity ID // no need to change
    let TM_ID="1001096933494158";  // Static ID -- No Need to change
//    let CT_ID="1007221976050210796" //"1007075777651485395";//Template ID - based on sms
    let OA="TNPFFD"; // // office header no need to change
    let username ="tnega_pfidc2"; // username
    let smsServerUrl = "https://digimate.airtel.in:15443/BULK_API/InstantJsonPush";

    let json_string = "{\"keyword\":\"DEMO\",\"timeStamp\":\"071818163530\",\"dataSet\":[{\"UNIQUE_ID\":\"735694wew\",\"MESSAGE\":\""+msg+"\",\"OA\":\""+OA+"\",\"MSISDN\":\""+phNumber+"\",\"CHANNEL\":\"SMS\",\"CAMPAIGN_NAME\":\"tnega_u\",\"CIRCLE_NAME\":\"DLT_SERVICE_IMPLICT\",\"USER_NAME\":\""+username+"\",\"DLT_TM_ID\":\""+TM_ID+"\",\"DLT_CT_ID\":\""+CT_ID+"\",\"DLT_PE_ID\":\""+PE_ID+"\",\"LANG_ID\":\"0\"}]}";
	
	let jsonObj = JSON.parse(json_string);
	
    console.log("Final JSON String :"+JSON.stringify(jsonObj));
    
	request({
        url:smsServerUrl,
        method: "POST",
        json:true,
        body:jsonObj
    }, function(error,response,body){
        console.log("1111 response body:"+body);
        console.log("2222 response from server:"+JSON.stringify(response));
        console.log("3333 error:"+error);
		let resp = JSON.parse(response.body);
		console.log("4444 resp:"+resp);
		if (response.statusCode==502) {
			return res.status(502).send({
				"responseCode":502,
				"response":'Error in sending OTP message. Try after sometime',
			});
		};
		if(resp===true){
			console.log("inside resonse body checking if")
			var last4Digits = phoneNumber.slice(-4);
			var mask = last4Digits.padStart(phoneNumber.length, '*');
			return res.status(200).send({
				"responseCode":sucessCode,
				"response":"Your OTP has been sent to your Registered Mobile" +' '+ mask
			});
		} else {
			return res.status(200).send({
				"responseCode":'',
				"response":'Error in sending OTP message. Try after sometime',
			});
		}
    });
	
	//var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+phNumber+'&text='+msg+'&route=6';
	//request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {});
	console.log("after seding sms, before returning to main code");
	//console.log("response from chennaismsserver"+JSON.stringify(response));
	
	// for c-dac sms gateway
	
	/*let msg1 ='Dear karthi, Your Service Request No:ACK345345 for closure has been successfully processed. -TNPFIDC'; 
	const options1 = {
    url: 'https://msdgweb.mgov.gov.in/esms/sendsmsrequestDLT',
    json: true,
	body: {
        username: 'TNPFC',
        password: 'Tnpfc@12345',
		content: msg1,
		senderid: 'TNPFFD',
		smsservicetype: 'singlemsg',
		mobileno: phNumber,
		key: '5e1bd55d-2699-4f89-b2a4-b55b3d517b9e',
		templateid: '1007250383759236488'		
		}
	};
	console.log("before post===="+ options1);
	request.post(options1, (err, res, body) => {
		console.log("inside post function");
		if (err) {
			return console.log(err);
		}
		console.log(`Status: ${res.statusCode}`);
		console.log(body);
	});	*/
}                
module.exports = loginMessage;