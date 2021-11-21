const db = require('../config/db.js');
const sequelize = require('sequelize');
const crypto = require("crypto");
var device = require('express-device');
var transPayment = db.paymentgateway;
//var transferDetails = db.transDetails; 
var microtime = require('microtime');
//const moment = require('moment');
var converter = require('number-to-words');
//var transPayment = db.paymentgateway;
var rtgsDetails = db.response;
var {BeneficiaryBank,IFSCCode,NameofBeneficiaryAccount,PaymentReference} = require('../config/hardCodeValues.js');

exports.custCreation = (req, res) => {
//var url = "https://test-node-api.tnpowerfinance.com/tnpfc-web/fd-calculator?transactionId=";
var url = 'https://www.tnpowerfinance.com/tnpfc-web/paymentpage?transactionId=';
console.log(url);
var { 
        productId, categoryId, period, interestPayment, depositAmount, 
        rateOfInterest, maturityAmount,title,fName,dob,gender,phoneNumber,
        emailId,aadhaarNumber,panNumber,residentialStatus,perAddress1,perAddress2,
        perState,perDistrict,perCity,perpinCode,corAddress1,corAddress2,corState,
        corDistrict,corCity,corpinCode,nomineeName,nomineeDob,nomineeRelationship,
        guardianName,guardianRelationship,verifiedPAN,verifiedAADHAAR,addressProofType,
        idProofUrl,profilePicUrl,addProofurl,paymentType
        
    } = req.body;
	
	console.log("idproof" +idProofUrl);
	console.log("profile" +profilePicUrl);
	console.log("address" +addProofurl);

    if (addProofurl instanceof Array) {
        addProofurl = addProofurl.map(element => element.url).toString();
         addProofurl = addProofurl.replace(/\,/g, "|");
        console.log("array"+addProofurl);
    } 
    console.log("string"+addProofurl);

        //const addressProof = [{"url": "https://we.com/app"},{"url": "https://we.com/app/iky.jpg"},{"url": "https://we.com/app/ikp.jpg"},{"url": "https://we.com/app/iky.jpg"}];
        // addProofurl = addProofurl.map(element => element.url).toString();
        // addProofurl = addProofurl.replace(/\|/g, ",");
        // console.log(addProofurl);
        // https://we.com/app,https://we.com/app/iky.jpg,https://we.com/app/ikp.jpg,https://we.com/app/iky.jpg 

    if(title) {
        guardianName = guardianName ? guardianName : null;
        guardianRelationship = guardianRelationship ? guardianRelationship : null;
       var channelId = req.device.type.toUpperCase();
		console.log(channelId);
        var dt = new Date();
		var currentDate = `${
			dt.getFullYear().toString().padStart(4, '0')}-${
			(dt.getMonth()+1).toString().padStart(2, '0')}-${
			dt.getDate().toString().padStart(2, '0')} ${
			dt.getHours().toString().padStart(2, '0')}:${
			dt.getMinutes().toString().padStart(2, '0')}:${
			dt.getSeconds().toString().padStart(2, '0')}`;
		console.log("date in specific format result====="+currentDate);
		//console.log("name==="+guardianName);
		//console.log("relationship====="+guardianRelationship);
						 
        db.sequelize.query('select API_FIRST_CUSTOMER_CREATION (:title,:fName,:dob,:gender,:phoneNumber,:emailId,:aadhaarNumber,\
            :panNumber,:residentialStatus,:perAddress1,:perAddress2,:perState,\
            :perDistrict,:perCity,:perpinCode,:corAddress1,:corAddress2,:corState,\
            :corDistrict,:corCity,:corpinCode,:nomineeName,:nomineeDob,:nomineeRelationship,\
			:guardianName,:guardianRelationship,:verifiedPAN,:verifiedAADHAAR,:addressProofType,\
			:idProofUrl,:profilePicUrl,:addProofurl,:channelId,:categoryId) AS "customerId" from dual',
            {replacements: {title: title, fName: fName, dob: dob, gender: gender, phoneNumber: phoneNumber, emailId: emailId,
            aadhaarNumber: aadhaarNumber, panNumber: panNumber, residentialStatus: residentialStatus, perAddress1: perAddress1,
            perAddress2: perAddress2, perState: perState, perDistrict: perDistrict, perCity: perCity, perpinCode: perpinCode,
            corAddress1: corAddress1, corAddress2: corAddress2, corState: corState, corDistrict: corDistrict, corCity: corCity,
            corpinCode: corpinCode, nomineeName: nomineeName, nomineeDob: nomineeDob, nomineeRelationship: nomineeRelationship,
			guardianName: guardianName,guardianRelationship: guardianRelationship,verifiedPAN: verifiedPAN,verifiedAADHAAR: verifiedAADHAAR,addressProofType: addressProofType,
			idProofUrl: idProofUrl,profilePicUrl: profilePicUrl, addProofurl: addProofurl, channelId:channelId, categoryId: categoryId
            }, type: sequelize.QueryTypes.SELECT }
        ).then(results =>{
			
			if(results.length > 0 && paymentType == "NETBANKING") {
                var customerid = results[0].customerId;
			    console.log("generated customer id is=================="+ customerid);
                var Amount = String(depositAmount); 
				var transactionId = String(microtime.now());
				console.log("generated transaction id is ================"+ transactionId);
				var reqData =  {
                    "dateTime":currentDate,"amount":Amount,"isMultiSettlement":"0","custMobile":"9901054678",
					"apiKey":"5M51M4KG6KG3BN4PBWNAD9BCTLDMK29H","productId":"DEFAULT","instrumentId":"NA",
					"udf5":"NA","cardType":"NA","txnType":"DIRECT","udf3":"NA","udf4":"NA","udf1":"true","type":"1.0",
					"udf2":paymentType,"merchantId":"M00034","cardDetails":"NA","custMail":"test@test.com",
					"returnURL":"https:\/\/portal-api.tnpowerfinance.com\/tnpfc\/v1\/processPGResponse",
					"channelId":"0","txnId":transactionId,"newCustomer":"true"
				};
		
				var key = "5M51M4KG6KG3BN4PBWNAD9BCTLDMK29H";					
				const iv = "5M51M4KG6KG3BN4P";	
				var encrypt = crypto.createCipheriv('aes-256-cbc', key, iv);
				console.log("sample data======="+JSON.stringify(reqData));
				var theCipher = encrypt.update(JSON.stringify(reqData), 'utf8', 'base64');
				theCipher += encrypt.final('base64');
				
				
				//console.log("encryption sample ----"+theCipher);	
		
				// let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
				// let decrypted = decipher.update(theCipher, 'base64', 'utf8');
				// decrypted  += decipher.final('utf8');
				// console.log("decryption data from payment gateway======"+decrypted); 
				
				// transPayment.build({ TRANSACTION_ID: transactionId, CHANNEL: "INTERNET",PROD_ID:paymentType,UTR_NUMBER: transactionId, AMOUNT:depositAmount
				// }).save().then(anotherTask => {console.log("insereted sucessfully");});
				
				// transferDetails.build({ TRANSACTION_ID: transactionId, PROD_ID: productId, CUST_ID: customerid, PERIOD: period, INTEREST_PAY_FREQUENCY: interestPayment, CUST_CATEGORY: categoryId, INT_RATE: rateOfInterest, MATURITY_AMOUNT: maturityAmount
                // }).save().then(anotherTask => {console.log("insereted sucessfully");});
                
                rtgsDetails.build({
                    TRANSACTION_ID:transactionId,CHANNEL:channelId,FE_PAY_TYPE:paymentType,
                    PRODUCT_ID: productId, CUSTOMER_ID: customerid, PERIOD: period, 
                    INT_PAY_FREQUENCY: interestPayment, CATEGORY_ID: categoryId, RATE_OF_INT: rateOfInterest, 
                    MATURITY_AMOUNT: maturityAmount,DEPOSIT_AMT:depositAmount,CREATED_DT:currentDate
                    }).save().then(results => {
                                return res.status(200).send({"redirectUrl":url,"paymentType":paymentType,"merchantId":"M00034","transactionId":transactionId,"customerId":customerid,"reqData":theCipher});
                }).catch(err => {res.status(500).send({ message: err.message});});
            
            } else if (results.length > 0 && paymentType == "RTGS") {
                var customerid = results[0].customerId;
			    console.log("generated customer id is=================="+ customerid);
                var resultTransactionId = "TNPFCL"+ String(microtime.now());
                var amount2Words = converter.toWords(depositAmount).replace(/[^a-zA-Z0-9]/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                
                rtgsDetails.build({
                    TRANSACTION_ID:resultTransactionId, PRODUCT_ID: productId,CUSTOMER_ID: customerid,FE_PAY_TYPE:paymentType, 
                    PERIOD: period,INT_PAY_FREQUENCY: interestPayment,CATEGORY_ID: categoryId, RATE_OF_INT: rateOfInterest, 
                    MATURITY_AMOUNT: maturityAmount,CHANNEL:channelId,DEPOSIT_AMT:depositAmount, 
                    CREATED_DT:currentDate
                    }).save().then(anotherTask => {
                                console.log("insereted sucessfully");
                                return res.status(200).send({
                                    "paymentType":paymentType, "depositorName":fName,"scheme":productId,"period":period,"interestRate":rateOfInterest,"frequency":interestPayment,
									"beneficiaryAccountNumber":resultTransactionId,"amounttoberemitted":depositAmount,
                                    "amountinWords ":amount2Words, "beneficiaryBank":BeneficiaryBank,
                                    "ifscCode":IFSCCode, "nameofBeneficiaryAccount":NameofBeneficiaryAccount, 
                                    "paymentReference":PaymentReference
                                });    
                }).catch(err => {res.status(500).send({message: err.message});})

            } else {
				return res.status(500).send({"responseCode":500,"response":"Problem in Creating Customer"});
			}
		}).catch(err => {res.status(500).send({ message: err.message});});
	} else {
            return res.status(400).send({"responseCode":400,"message": "Bad request check input parameters"});
    }
}
 
 
 
 

  
 
  
  