//const db = require('./db.js');
const db = require('../config/db.js');
const sequelize = require('sequelize');
const crypto = require("crypto");
var device = require('express-device');
var transPayment = db.paymentgateway;
var transferDetails = db.transDetails;
var paymentDetails = db.response; 
var microtime = require('microtime');
var converter = require('number-to-words');
var rtgsDetails = db.response;
var {BeneficiaryBank,IFSCCode,NameofBeneficiaryAccount,PaymentReference} = require('../config/hardCodeValues.js');

exports.payment = (req, res) => {
//var url = "https://test-node-api.tnpowerfinance.com/tnpfc-db/fd-calculator?transactionId=";
var url = 'https://www.tnpowerfinance.com/tnpfc-db/paymentpage?transactionId=';
var { 
        productId, customerId, categoryId, period, interestPayment, 
        depositAmount, rateOfInterest, maturityAmount,paymentType
    } = req.body;
    var dt = new Date();
	var channelId = req.device.type.toUpperCase();
	console.log(channelId);
    var currentDate = `${
        dt.getFullYear().toString().padStart(4, '0')}-${
        (dt.getMonth()+1).toString().padStart(2, '0')}-${
        dt.getDate().toString().padStart(2, '0')} ${
        dt.getHours().toString().padStart(2, '0')}:${
        dt.getMinutes().toString().padStart(2, '0')}:${
        dt.getSeconds().toString().padStart(2, '0')}`;
    console.log("date in specific format result====="+currentDate);    
    
    if( productId && customerId && categoryId && period && Number(depositAmount>0) && rateOfInterest && 
        maturityAmount && ((productId=='202' && interestPayment==0) || (productId=='201' && interestPayment>0))) {
			
		// db.sequelize.query('select PRODUCTID, CASE :interestPayment WHEN  \'30\' THEN MONTHLYINTRATE WHEN \'90\' THEN QUARTERLYINTRATE WHEN \'360\' THEN YEARLYINTRATE ELSE ONMATURITYRATE END AS INT_RATE from api_productdetails where productid =:productId and tenure =:period and categoryid =:categoryId',
		// {replacements: {interestPayment: interestPayment, productId:productId, period: period, categoryId:categoryId }, type: sequelize.QueryTypes.SELECT}).then(results =>{
		// 	console.log("result==============="+results);
		// 	var s = JSON.stringify(results);
		// })
		if (productId=='201'){
			var interestAmount = ((Number(depositAmount) * Number(rateOfInterest)/1200)) * Number(period);
			var maturityAmt = Math.floor(Number(depositAmount)) + interestAmount;
			maturityAmt = Math.floor(Number(maturityAmt));
			console.log(" 201 maturity amount "+maturityAmt);
			console.log("payment gateway");
		} else if (productId=='202') {
			var tenure = Number(period) / 12;
			var maturityAmt = Number(depositAmount) * Math.pow(1 + (Number(rateOfInterest) / (12 * 100)), 12 *  tenure);
			maturityAmt = Math.floor(Number(maturityAmt));
			console.log("amount======="+maturityAmt);
			console.log("payment gateway");
		}
		    if (maturityAmt == Number(maturityAmount) && paymentType == "NETBANKING") {
                var Amount = String(depositAmount); 
			    var transactionId = String(microtime.now());
                var reqData =   { "dateTime":currentDate,"amount":Amount,"isMultiSettlement":"0","custMobile":"9901054678",
					"apiKey":"5M51M4KG6KG3BN4PBWNAD9BCTLDMK29H","productId":"DEFAULT","instrumentId":"NA",
					"udf5":"NA","cardType":"NA","txnType":"DIRECT","udf3":"NA","udf4":"NA","udf1":"false","type":"1.0",
					"udf2":paymentType,"merchantId":"M00034","cardDetails":"NA","custMail":"test@test.com",
					"returnURL":"https:\/\/portal-api.tnpowerfinance.com\/tnpfc\/v1\/processPGResponse",
					"channelId":"0","txnId":transactionId
                };
            // encryption for req data    
                var key = "5M51M4KG6KG3BN4PBWNAD9BCTLDMK29H";					
		        const iv = "5M51M4KG6KG3BN4P";	
		        var encrypt = crypto.createCipheriv('aes-256-cbc', key, iv);
		        console.log("sample data======="+JSON.stringify(reqData));
                var theCipher = encrypt.update(JSON.stringify(reqData), 'utf8', 'base64');
                theCipher += encrypt.final('base64');
                console.log("encryption sample ----"+theCipher);
                
                paymentDetails.build({
                    TRANSACTION_ID:transactionId,CHANNEL:channelId,FE_PAY_TYPE:paymentType,
                    PRODUCT_ID: productId, CUSTOMER_ID: customerId, PERIOD: period, 
                    INT_PAY_FREQUENCY: interestPayment, CATEGORY_ID: categoryId, RATE_OF_INT: rateOfInterest, 
                    MATURITY_AMOUNT: maturityAmount,DEPOSIT_AMT:depositAmount,CREATED_DT:currentDate
                    }).save().then(results => {
                                return res.status(200).send({"redirectUrl":url,"paymentType":paymentType,"merchantId":"M00034","transactionId":transactionId,"customerId":customerId,"reqData":theCipher});
                }).catch(err => {res.status(500).send({ message: err.message});});

                // let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
                // let decrypted = decipher.update(theCipher, 'base64', 'utf8');
                // decrypted  += decipher.final('utf8');
                // console.log("decryption data from payment gateway======"+decrypted); 
        
                // transPayment.build({ TRANSACTION_ID: transactionId, CHANNEL: "INTERNET",PROD_ID:"NETBANK",UTR_NUMBER: transactionId, AMOUNT:depositAmount
		        // }).save().then(anotherTask => {console.log("insereted sucessfully");});
		
		        // transferDetails.build({ TRANSACTION_ID: transactionId, PROD_ID: productId, CUST_ID: customerId, PERIOD: period, INTEREST_PAY_FREQUENCY: interestPayment, CUST_CATEGORY: categoryId, INT_RATE: rateOfInterest, MATURITY_AMOUNT: maturityAmount
	            // }).save().then(anotherTask => {console.log("insereted sucessfully");});
										
		        //return res.status(200).send({"redirectUrl":url,"merchantId":"M0000346","transactionId":transactionId,"reqData":theCipher});
            } else if (maturityAmt == Number(maturityAmount) && paymentType == "RTGS") {
                var resultTransactionId = "TNPFCL"+ String(microtime.now());
                var amount2Words = converter.toWords(depositAmount).replace(/[^a-zA-Z0-9]/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                //console.log(convertedResult);

                paymentDetails.build({
                    TRANSACTION_ID:resultTransactionId, PRODUCT_ID: productId,CUSTOMER_ID: customerId,FE_PAY_TYPE:paymentType, 
                    PERIOD: period,INT_PAY_FREQUENCY: interestPayment,CATEGORY_ID: categoryId, RATE_OF_INT: rateOfInterest, 
                    MATURITY_AMOUNT: maturityAmount,CHANNEL:channelId,DEPOSIT_AMT:depositAmount, 
                    CREATED_DT:currentDate
                    }).save().then(anotherTask => {
                                console.log("insereted sucessfully");
                                return res.status(200).send({
									"paymentType":paymentType,"scheme":productId,"period":period,"interestRate":rateOfInterest,"frequency":interestPayment,
                                    "beneficiaryAccountNumber":resultTransactionId,"amounttoberemitted":depositAmount,
                                    "amountinWords ":amount2Words, "beneficiaryBank":BeneficiaryBank,
                                    "ifscCode":IFSCCode, "nameofBeneficiaryAccount":NameofBeneficiaryAccount, 
                                    "paymentNarration":PaymentReference
                                });    
                }).catch(err => {res.status(500).send({message: err.message});})
            } else {
			    return res.status(400).send({"responseCode":400,"response": "Invalid inputs found. Please retry"});
		    }
    } else {
            return res.status(400).send({"responseCode":400,"response": "Bad request check input parameters"});
    }
}
 
 
 
 

  
 
  
  