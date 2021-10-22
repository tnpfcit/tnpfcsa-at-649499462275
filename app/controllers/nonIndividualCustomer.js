const db = require('../config/db.js');
const sequelize = require('sequelize');
const crypto = require("crypto");
var device = require('express-device');
var microtime = require('microtime');
var converter = require('number-to-words');
var word = require('../helpers/convert2words');
var rtgsDetails = db.response;
var logger = require('../config/logger');
var {BeneficiaryBank,IFSCCode,NameofBeneficiaryAccount,PaymentReference,existurl,newurl,key,iv,appkey,appiv,appmerchantId,merchantId,hdfcprodReturnUrl,sucessCode,badRequestcode} = require('../config/env.js');

exports.nonIndividualCustomer = (req, res) => {
    //var channelId = req.device.type.toUpperCase();
	var agentId = 'SYS';
    var { 
        
        productId,categoryId,period,interestPayment,depositAmount,rateOfInterest,maturityAmount,paymentType,reqChannel,
        companyName,constitution,panNumber,phoneNumber,emailId,companyRegUrl,tdsExempted,tdsDocumentUrl,
        perAddress1,perAddress2,perState,perDistrict,perCity,perpinCode,corAddress1,corAddress2,corState,
        corDistrict,corCity,corpinCode,addressProofType,addProofurl,authSignName1,authSignDesignation1,
        authSignPhNumber1,authSignAadhaar1,authSignProfilePicUrl1,authSignSignatureUrl1, authSignName2,
        authSignDesignation2,authSignPhNumber2,authSignAadhaar2,authSignProfilePicUrl2,authSignSignatureUrl2,
        authSigndocumentUrl,bankAcctNumber,bankName,bankAcctHolderName,bankIfscCode,bankChequeUrl,authSignEmail1,
		authSignEmail2

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
    
    if (addProofurl instanceof Array) {
        addProofurl = addProofurl.map(element => element.url).toString();
        addProofurl = addProofurl.replace(/\,/g, "|");
    }
	
	if(tdsExempted == 'N'){
		tdsDocumentUrl = null;
	}
	
	var channelId;
    if(reqChannel == 'android'){
        channelId = 'app';
    } else {
        channelId = 'portal';
    }
    
    var transId;
    
    if(paymentType == 'NETBANKING'){
        transId = String(microtime.now());
    } else {
        transId = "TNPFCL"+ String(microtime.now());
    }
    
    if(productId) {
        var dt = new Date();
		var currentDate = `${
		dt.getFullYear().toString().padStart(4, '0')}-${
		(dt.getMonth()+1).toString().padStart(2, '0')}-${
		dt.getDate().toString().padStart(2, '0')} ${
		dt.getHours().toString().padStart(2, '0')}:${
		dt.getMinutes().toString().padStart(2, '0')}:${
		dt.getSeconds().toString().padStart(2, '0')}`;
		
		db.sequelize.query('select API_CORPORATE_CUST_CREATION(:companyName,:constitution,:panNumber,:phoneNumber,:emailId,:companyRegUrl,:tdsExempted,:tdsDocumentUrl,:perAddress1,:perAddress2,:perState,:perDistrict,:perCity,:perpinCode,:corAddress1,\
            :corAddress2,:corState,:corDistrict,:corCity,:corpinCode,:addressProofType,:addProofurl,:authSignName1,:authSignDesignation1,:authSignPhNumber1,:authSignAadhaar1,:authSignProfilePicUrl1,:authSignSignatureUrl1,\
            :authSignName2,:authSignDesignation2,:authSignPhNumber2,:authSignAadhaar2,:authSignProfilePicUrl2,:authSignSignatureUrl2,:authSigndocumentUrl,:bankAcctNumber,:bankName,:bankAcctHolderName,:bankIfscCode,\
            :bankChequeUrl,:channelId,:transId, :agentId,:authSignEmail1,:authSignEmail2) AS "customerId" from dual',
            {replacements: {companyName: companyName,constitution : constitution,panNumber:panNumber,phoneNumber: phoneNumber,emailId: emailId,companyRegUrl: companyRegUrl,tdsExempted: tdsExempted,
            tdsDocumentUrl: tdsDocumentUrl,perAddress1:perAddress1,perAddress2: perAddress2,perState: perState,perDistrict: perDistrict,perCity: perCity,perpinCode: perpinCode,corAddress1:corAddress1,
            corAddress2:corAddress2,corState:corState,corDistrict: corDistrict,corCity: corCity,corpinCode: corpinCode,addressProofType: addressProofType,addProofurl: addProofurl,authSignName1: authSignName1,
            authSignDesignation1: authSignDesignation1,authSignPhNumber1: authSignPhNumber1,authSignAadhaar1: authSignAadhaar1,authSignProfilePicUrl1: authSignProfilePicUrl1,authSignSignatureUrl1: authSignSignatureUrl1, 
            authSignName2: authSignName2,authSignDesignation2: authSignDesignation2,authSignPhNumber2: authSignPhNumber2,authSignAadhaar2: authSignAadhaar2,authSignProfilePicUrl2: authSignProfilePicUrl2,
            authSignSignatureUrl2: authSignSignatureUrl2,authSigndocumentUrl: authSigndocumentUrl,bankAcctNumber: bankAcctNumber,bankName: bankName,bankAcctHolderName: bankAcctHolderName,bankIfscCode: bankIfscCode, 
            bankChequeUrl: bankChequeUrl,channelId: channelId,transId: transId, agentId: agentId, authSignEmail1: authSignEmail1, authSignEmail2: authSignEmail2
            }, type: sequelize.QueryTypes.SELECT}
        ).then(results =>{
			
			if(results.length > 0 && paymentType == "NETBANKING" && transId) {
                if(reqChannel == 'android'){
                    logger.info("request channel information ========" + reqChannel);
                    var customerid = results[0].customerId;
                    var Amount = String(depositAmount); 
                    var transactionId = transId;
                    var reqData =  {
                        
                        "dateTime":currentDate,"amount":Amount,"isMultiSettlement":"0","custMobile":"9901054678",
                        "apiKey":appkey,"productId":"DEFAULT","instrumentId":"NA",
                        "udf5":"NA","cardType":"NA","txnType":"DIRECT","udf3":"NA","udf4":"NA","udf1":"true","type":"1.0",
                        "udf2":paymentType,"merchantId":appmerchantId,"cardDetails":"NA","custMail":"test@test.com",
                        "returnURL":hdfcprodReturnUrl,
                        "channelId":"0","txnId":transactionId,"newCustomer":"true"
                    };	
                    var encrypt = crypto.createCipheriv('aes-256-cbc', appkey, appiv);
                    var theCipher = encrypt.update(JSON.stringify(reqData), 'utf8', 'base64');
                    theCipher += encrypt.final('base64');

                } else {
                    logger.info("portal request channel info ======= " + reqChannel);
                    var customerid = results[0].customerId;
                    var Amount = String(depositAmount); 
                    var transactionId = transId;
                    var reqData =  {
                        
                        "dateTime":currentDate,"amount":Amount,"isMultiSettlement":"0","custMobile":"9901054678",
                        "apiKey":key,"productId":"DEFAULT","instrumentId":"NA",
                        "udf5":"NA","cardType":"NA","txnType":"DIRECT","udf3":"NA","udf4":"NA","udf1":"true","type":"1.0",
                        "udf2":paymentType,"merchantId":merchantId,"cardDetails":"NA","custMail":"test@test.com",
                        "returnURL":hdfcprodReturnUrl,
                        "channelId":"0","txnId":transactionId,"newCustomer":"true"
                    };	
                    var encrypt = crypto.createCipheriv('aes-256-cbc', key, iv);
                    var theCipher = encrypt.update(JSON.stringify(reqData), 'utf8', 'base64');
                    theCipher += encrypt.final('base64');

                }				
			    rtgsDetails.build({
                    TRANSACTION_ID:transactionId,CHANNEL:channelId,FE_PAY_TYPE:paymentType,PRODUCT_ID: productId, 
                    CUSTOMER_ID: customerid, PERIOD: period, INT_PAY_FREQUENCY: interestPayment, CATEGORY_ID: categoryId, RATE_OF_INT: rateOfInterest, 
                    MATURITY_AMOUNT: maturityAmount,DEPOSIT_AMT:depositAmount,CREATED_DT:currentDate}
                ).save().then(results => {
                    if(reqChannel == 'android'){
                        return res.status(200).send({
                            "responseCode":sucessCode,
                            "redirectUrl":newurl,
							"paymentType":paymentType,
							"merchantId":appmerchantId,
                            "transactionId":transactionId,
							"customerId":customerid,
							"reqData":theCipher
                        });

                    } else {
                        return res.status(200).send({
                            "responseCode":sucessCode,
                            "redirectUrl":newurl,"paymentType":paymentType,"merchantId":merchantId,
                            "transactionId":transactionId,"customerId":customerid,"reqData":theCipher,
                            "response":[{
                                "redirectUrl":newurl,"paymentType":paymentType,"merchantId":merchantId,
                                "transactionId":transactionId,"customerId":customerid,"reqData":theCipher
                            }]
                        });
                    }
                }).catch(err => {
                    res.status(500).send({ message: err.message});
                    logger.error(err);
                });
            
            } else if (results.length > 0 && paymentType == "RTGS" && transId) {
                var customerid = results[0].customerId;
                //var resultTransactionId = "TNPFCL"+ String(microtime.now());
                var resultTransactionId = transId;
                var amount2Words = word.convertNumberToWords(depositAmount);
                //var amount2Words = converter.toWords(depositAmount).replace(/[^a-zA-Z0-9]/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                
                rtgsDetails.build({
                    TRANSACTION_ID:resultTransactionId, PRODUCT_ID: productId,CUSTOMER_ID: customerid,FE_PAY_TYPE:paymentType, 
                    PERIOD: period,INT_PAY_FREQUENCY: interestPayment,CATEGORY_ID: categoryId, RATE_OF_INT: rateOfInterest, 
                    MATURITY_AMOUNT: maturityAmount,CHANNEL:channelId,DEPOSIT_AMT:depositAmount,CREATED_DT:currentDate}
                ).save().then(anotherTask => {
                        return res.status(200).send({
                            "responseCode":sucessCode,
                            "paymentType":paymentType, "depositorName":companyName,"scheme":productId,"period":period,"interestRate":rateOfInterest,"frequency":interestPayment,
							"beneficiaryAccountNumber":resultTransactionId,"amounttoberemitted":depositAmount,
                            "amountinWords":amount2Words, "beneficiaryBank":BeneficiaryBank,
                            "ifscCode":IFSCCode, "nameofBeneficiaryAccount":NameofBeneficiaryAccount, 
                            "paymentReference":PaymentReference,
                            "response":[{
                                "paymentType":paymentType, "depositorName":companyName,"scheme":productId,"period":period,"interestRate":rateOfInterest,"frequency":interestPayment,
							    "beneficiaryAccountNumber":resultTransactionId,"amounttoberemitted":depositAmount,
                                "amountinWords":amount2Words, "beneficiaryBank":BeneficiaryBank,
                                "ifscCode":IFSCCode, "nameofBeneficiaryAccount":NameofBeneficiaryAccount, 
                                "paymentReference":PaymentReference
                            }]
                        });    
                }).catch(err => {
					logger.error(err);
					res.status(500).send({message: err.message});})

            } else {
                return res.status(500).send({"responseCode":500,"response":"Problem in Creating Customer"});
			}
		}).catch(err => {
			logger.error(err);
			res.status(500).send({data:null, message: err.message});});
	} else {
        return res.status(400).send({"responseCode":badRequestcode,"message": "Bad request check input parameters"});
    }
}