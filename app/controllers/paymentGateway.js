const db = require('../config/db.js');
const sequelize = require('sequelize');
const logger = require('../config/logger');
const crypto = require("crypto");
var device = require('express-device');
var paymentDetails = db.response; 
var microtime = require('microtime');
var converter = require('number-to-words');
var nomineeDetails = db.banknomineedetails;
var {BeneficiaryBank,IFSCCode,NameofBeneficiaryAccount,PaymentReference,existurl,key,iv,appkey,appiv,appmerchantId,merchantId,hdfcprodReturnUrl,sucessCode,responseMessage,badRequestcode} = require('../config/env.js');

exports.payment = (req, res , err) => {
    var agentId = 'SYS';
	var { 
            productId, customerId, categoryId, period, interestPayment, 
            depositAmount, rateOfInterest, maturityAmount,paymentType,reqChannel,
            nomineeName,nomineeDob,nomineeRelationship,guardianName,guardianRelationship,
            depositType,jointHolderName,bankAcctNumber,bankName,bankAcctHolderName,bankIfscCode,bankChequeUrl,jointHolder2Name

        } = req.body;
    logger.info(
		`${new Date()} || 
		 ${req.originalUrl} || 
		 ${JSON.stringify(req.body)} || 
		 ${req.ip} || 
		 ${req.protocol}`
	);
	if(depositAmount < 50000){
		return res.status(500).send({"responseCode":"500","response":"Deposit Amount Should not be less than Rs 50000"});
	}
	logger.info("REQ BODY==="+JSON.stringify(req.body));
    var dt = new Date();
    //var channelId = req.device.type.toUpperCase();
	var channelId;
    if(reqChannel == 'android'){
        channelId = 'app';
    } else {
        channelId = 'portal';
    }
	
	
    guardianName = guardianName ? guardianName : null;
    guardianRelationship = guardianRelationship ? guardianRelationship : null;
    jointHolderName = jointHolderName ? jointHolderName : null;
	jointHolder2Name = jointHolder2Name ? jointHolder2Name : null;
	bankChequeUrl=bankChequeUrl?bankChequeUrl:null;
	
	if(bankChequeUrl == 'none'){
		bankChequeUrl = null;
	}
	
    var currentDate = `${
        dt.getFullYear().toString().padStart(4, '0')}-${
        (dt.getMonth()+1).toString().padStart(2, '0')}-${
        dt.getDate().toString().padStart(2, '0')} ${
        dt.getHours().toString().padStart(2, '0')}:${
        dt.getMinutes().toString().padStart(2, '0')}:${
        dt.getSeconds().toString().padStart(2, '0')}`;    
    
    if(productId && customerId && categoryId && period && Number(depositAmount>0) && rateOfInterest && 
        maturityAmount && ((productId =='202' && interestPayment == 0) || (productId =='201' && interestPayment > 0))
        && depositType && bankAcctNumber && bankName && bankAcctHolderName && bankIfscCode) {
		// db.sequelize.query('select PRODUCTID, CASE :interestPayment WHEN  \'30\' THEN MONTHLYINTRATE WHEN \'90\' THEN QUARTERLYINTRATE WHEN \'360\' THEN YEARLYINTRATE ELSE ONMATURITYRATE END AS INT_RATE from api_productdetails where productid =:productId and tenure =:period and categoryid =:categoryId',
		// {replacements: {interestPayment: interestPayment, productId:productId, period: period, categoryId:categoryId }, type: sequelize.QueryTypes.SELECT}).then(results =>{
		// 	logger.info("result==============="+results);
		// 	var s = JSON.stringify(results);
		// })
		if (productId=='201'){
			var interestAmount = ((Number(depositAmount) * Number(rateOfInterest)/1200)) * Number(period);
			//var maturityAmt = Math.floor(Number(depositAmount)) + interestAmount;
			if (channelId =='app')
			{
				var maturityAmt = Math.floor(Number(depositAmount))+ interestAmount;
			}
			else
			{
				var maturityAmt = Math.floor(Number(depositAmount));
			}
			maturityAmt = Math.floor(Number(maturityAmt));
		} else if (productId=='202') {
			var tenure = Number(period) / 12;
			var maturityAmt = Number(depositAmount) * Math.pow(1 + (Number(rateOfInterest) / (4 * 100)), 4 *  tenure);
			maturityAmt = Math.floor(Number(maturityAmt));
		}
        
        if (maturityAmt == Number(maturityAmount) && paymentType == "NETBANKING") {
            var Amount = String(depositAmount); 
            var transactionId = String(microtime.now());
            if (reqChannel == 'android'){
                logger.info("requestchannel======"+reqChannel);
				logger.info("application merchantid======"+appmerchantId);
                var reqData =   { 
                    
                    "dateTime":currentDate,"amount":Amount,"isMultiSettlement":"0","custMobile":"9901054678",
                    "apiKey":appkey,"productId":"DEFAULT","instrumentId":"NA",
                    "udf5":"NA","cardType":"NA","txnType":"DIRECT","udf3":"NA","udf4":"NA","udf1":"false","type":"1.0",
                    "udf2":paymentType,"merchantId":appmerchantId,"cardDetails":"NA","custMail":"test@test.com",
                    "returnURL":hdfcprodReturnUrl,"channelId":"0","txnId":transactionId
                };
                var encrypt = crypto.createCipheriv('aes-256-cbc',appkey,appiv);
                var theCipher = encrypt.update(JSON.stringify(reqData), 'utf8', 'base64');
                theCipher += encrypt.final('base64');

            } else {
                var reqData =   { 
                    
                    "dateTime":currentDate,"amount":Amount,"isMultiSettlement":"0","custMobile":"9901054678",
                    "apiKey":key,"productId":"DEFAULT","instrumentId":"NA",
                    "udf5":"NA","cardType":"NA","txnType":"DIRECT","udf3":"NA","udf4":"NA","udf1":"false","type":"1.0",
                    "udf2":paymentType,"merchantId":merchantId,"cardDetails":"NA","custMail":"test@test.com",
                    "returnURL":hdfcprodReturnUrl,"channelId":"0","txnId":transactionId
                };
                var encrypt = crypto.createCipheriv('aes-256-cbc', key, iv);
                var theCipher = encrypt.update(JSON.stringify(reqData), 'utf8', 'base64');
                theCipher += encrypt.final('base64');
            }
            
            db.sequelize.query('select API_PAYMENT_NETBANKING(:transactionId,:channelId,:paymentType,:productId,:customerId,:period,:interestPayment,:categoryId,:rateOfInterest,:maturityAmount,:depositAmount,\
                :nomineeName,:nomineeDob,:nomineeRelationship,:guardianName,:guardianRelationship,:depositType,:jointHolderName,\
                :bankAcctNumber,:bankName,:bankAcctHolderName,:bankIfscCode,:bankChequeUrl,:agentId,:jointHolder2Name) AS "transactionId" from dual',
                {replacements: {transactionId: transactionId,channelId: channelId,paymentType: paymentType,productId: productId, customerId: customerId, period: period,interestPayment: interestPayment,
                categoryId: categoryId, rateOfInterest: rateOfInterest, maturityAmount: maturityAmount,depositAmount: depositAmount,nomineeName: nomineeName, nomineeDob: nomineeDob, nomineeRelationship: nomineeRelationship,
                guardianName: guardianName,guardianRelationship: guardianRelationship,depositType: depositType, jointHolderName: jointHolderName,
                bankAcctNumber: bankAcctNumber, bankName: bankName, bankAcctHolderName: bankAcctHolderName, bankIfscCode: bankIfscCode, bankChequeUrl: bankChequeUrl, agentId: agentId, jointHolder2Name: jointHolder2Name
                }, type: sequelize.QueryTypes.SELECT}
            ).then(results =>{
				logger.info("transactionId=="+JSON.stringify(results));
                if(results.length > 0){

                    if(reqChannel == 'android'){
                        logger.info("requestchannel after function is executed ======"+reqChannel);
                        //return res.status(200).send({
                           // "responseCode":sucessCode,
                           // "response":[{
                           // "redirectUrl":existurl,"paymentType":paymentType,"merchantId":appmerchantId,
                           // "transactionId":transactionId,"customerId":customerId,"reqData":theCipher
                           // }]
                       // });
					   return res.status(200).send({
                            "responseCode":sucessCode,
                            "redirectUrl":existurl,
							"paymentType":paymentType,
							"merchantId":appmerchantId,
                            "transactionId":transactionId,
							"customerId":customerId,
							"reqData":theCipher
                        });
                    } else {
                        return res.status(200).send({
                            "responseCode":sucessCode,
                            "redirectUrl":existurl,"paymentType":paymentType,"merchantId":merchantId,
                            "transactionId":transactionId,"customerId":customerId,"reqData":theCipher,
                            "response":[{
                            "redirectUrl":existurl,"paymentType":paymentType,"merchantId":merchantId,
                            "transactionId":transactionId,"customerId":customerId,"reqData":theCipher
                            }]
                        });
                    }

                } else {
                    return res.status(500).send({"responseCode":500,"response":"Technical error. Please try again later"});
                }
            }).catch(err => {
					logger.error(err);
                    res.status(500).send({ data:null, message:err.message});
                    
            });

        } else if (maturityAmt == Number(maturityAmount) && paymentType == "RTGS") {
                var transactionId = "TNPFCL"+ String(microtime.now());
                var amount2Words = converter.toWords(depositAmount).replace(/[^a-zA-Z0-9]/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                
                db.sequelize.query('select API_PAYMENT_NETBANKING(:transactionId,:channelId,:paymentType,:productId,:customerId,:period,:interestPayment,:categoryId,:rateOfInterest,:maturityAmount,:depositAmount,\
                    :nomineeName,:nomineeDob,:nomineeRelationship,:guardianName,:guardianRelationship,:depositType,:jointHolderName,\
                    :bankAcctNumber,:bankName,:bankAcctHolderName,:bankIfscCode,:bankChequeUrl,:agentId,:jointHolder2Name) AS "transactionId" from dual',
                    {replacements: {transactionId: transactionId,channelId: channelId,paymentType: paymentType,productId: productId, customerId: customerId, period: period,interestPayment: interestPayment,
                    categoryId: categoryId, rateOfInterest: rateOfInterest, maturityAmount: maturityAmount,depositAmount: depositAmount,nomineeName: nomineeName, nomineeDob: nomineeDob, nomineeRelationship: nomineeRelationship,
                    guardianName: guardianName,guardianRelationship: guardianRelationship,depositType: depositType, jointHolderName: jointHolderName,
                    bankAcctNumber: bankAcctNumber, bankName: bankName, bankAcctHolderName: bankAcctHolderName, bankIfscCode: bankIfscCode, bankChequeUrl: bankChequeUrl, agentId: agentId, jointHolder2Name: jointHolder2Name
                    }, type: sequelize.QueryTypes.SELECT}
                ).then(results =>{

                        if(results.length > 0){
                            return res.status(200).send({
                                "responseCode":"200",
                                "paymentType":paymentType,"scheme":productId,"period":period,"interestRate":rateOfInterest,"frequency":interestPayment,
                                "beneficiaryAccountNumber":transactionId,"amounttoberemitted":depositAmount,
                                "amountinWords":amount2Words, "beneficiaryBank":BeneficiaryBank,
                                "ifscCode":IFSCCode, "nameofBeneficiaryAccount":NameofBeneficiaryAccount, 
                                "paymentNarration":PaymentReference,
                                "response":[{
                                    "paymentType":paymentType,"scheme":productId,"period":period,"interestRate":rateOfInterest,"frequency":interestPayment,
                                    "beneficiaryAccountNumber":transactionId,"amounttoberemitted":depositAmount,
                                    "amountinWords":amount2Words, "beneficiaryBank":BeneficiaryBank,
                                    "ifscCode":IFSCCode, "nameofBeneficiaryAccount":NameofBeneficiaryAccount, 
                                    "paymentNarration":PaymentReference
                                }]
                            });
                        } else {
                            return res.status(500).send({"responseCode":500,"response":"Technical error. Please try again later"});
                        }
                }).catch(err => {
                        res.status(500).send({data:null,message: err.message});
                        logger.error(err);
                });        

        } else {
			return res.status(500).send({"responseCode":500,"response": "Invalid inputs found. Please retry"});
		}
    } else {
        return res.status(400).send({"responseCode":badRequestcode,"response":responseMessage});
    }
}