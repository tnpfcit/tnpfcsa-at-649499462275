const db = require('../config/db.js');
const sequelize = require('sequelize');
const crypto = require("crypto");
var device = require('express-device');
var microtime = require('microtime');
var converter = require('number-to-words');
var word = require('../helpers/convert2words');
var rtgsDetails = db.response;
var logger = require('../config/logger');
var {
    BeneficiaryBank,
    IFSCCode,
    NameofBeneficiaryAccount,
    PaymentReference,
    existurl,
    newurl,
    key,
    iv,
    appkey,
    appiv,
    androidmerchantId,
    merchantId,
    hdfcprodReturnUrl,
    sucessCode,
    badRequestcode,
    responseMessage,
	iosmerchantId,
	iosappkey,
	iosappiv
} = require('../config/env.js');

exports.nonIndividualCustomer = (req, res) => {
    var agentId = 'SYS';
    var { 
        productId,
        categoryId,
        period,
        interestPayment,
        depositAmount,
        rateOfInterest,
        maturityAmount,
        paymentType,
        reqChannel,
        companyName,
        constitution,
        panNumber,
        phoneNumber,
        emailId,
        companyRegUrl,
        tdsExempted,
        tdsDocumentUrl,
        perAddress1,
        perAddress2,
        perState,
        perDistrict,
        perCity,
        perpinCode,
        corAddress1,
        corAddress2,
        corState,
        corDistrict,
        corCity,
        corpinCode,
        addressProofType,
        addProofurl,
        authSignName1,
        authSignDesignation1,
        authSignPhNumber1,
        authSignAadhaar1,
        authSignProfilePicUrl1,
        authSignSignatureUrl1,
        authSignName2,
        authSignDesignation2,
        authSignPhNumber2,
        authSignAadhaar2,
        authSignProfilePicUrl2,
        authSignSignatureUrl2,
        authSigndocumentUrl,
		authSignEmail1,
		authSignEmail2,
        bankAcctNumber,
        bankName,
        bankAcctHolderName,
        bankIfscCode,
        bankChequeUrl,
		perCountry,
		corCountry
    } = req.body;

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);
	
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
	var transId;
    
	if(reqChannel == 'android'){
		var channelId = 'app';
		var encryptkey = appkey;
        var encryptiv = appiv;
		var reqMerchantId = androidmerchantId;
		
	} else if (reqChannel == 'ios'){
		var channelId = 'app';
		var encryptkey = iosappkey;
        var encryptiv = iosappiv;
		var reqMerchantId = iosmerchantId;
	}		
	else {
		var channelId = 'portal';
		var encryptkey = key;
        var encryptiv = iv;
		var reqMerchantId = merchantId;
    }
	
	logger.info ("key details: id="+reqMerchantId+" key="+encryptkey+" iv="+encryptiv+" channelId="+channelId);
	authSignEmail1 = authSignEmail1 ? authSignEmail1 : null;
	authSignEmail2 = authSignEmail2 ? authSignEmail2 : null;
	bankChequeUrl=bankChequeUrl?bankChequeUrl:null;
    addProofurl=addProofurl?addProofurl:null;
	//perCountry=perCountry?perCountry:null;
	//corCountry=corCountry?corCountry:null;
    
    if(paymentType == 'NETBANKING'){
        transId = String(microtime.now());
    } else {
        transId = "TNPFCL"+ String(microtime.now());
    }
    console.log(transId);
	
    if(productId) {
        var dt = new Date();
		var currentDate = `${
		dt.getFullYear().toString().padStart(4, '0')}-${
		(dt.getMonth()+1).toString().padStart(2, '0')}-${
		dt.getDate().toString().padStart(2, '0')} ${
		dt.getHours().toString().padStart(2, '0')}:${
		dt.getMinutes().toString().padStart(2, '0')}:${
		dt.getSeconds().toString().padStart(2, '0')}`;
		
		db.sequelize.query('select API_CORPORATE_CUST_CREATION(:companyName,:constitution,:panNumber,:phoneNumber,:emailId,:companyRegUrl,:tdsExempted,:tdsDocumentUrl,:perAddress1,:perAddress2,:perState,:perDistrict,:perCity,:perpinCode,:corAddress1,:corAddress2,:corState,:corDistrict,:corCity,:corpinCode,:addressProofType,:addProofurl,:authSignName1,:authSignDesignation1,:authSignPhNumber1,:authSignAadhaar1,:authSignProfilePicUrl1,:authSignSignatureUrl1,:authSignName2,:authSignDesignation2,:authSignPhNumber2,:authSignAadhaar2,:authSignProfilePicUrl2,:authSignSignatureUrl2,:authSigndocumentUrl,:bankAcctNumber,:bankName,:bankAcctHolderName,:bankIfscCode,:bankChequeUrl,:channelId,:transId,:agentId,:authSignEmail1,:authSignEmail2,:perCountry, :corCountry) AS "customerId" from dual',
            {replacements:{
                companyName: companyName,
                constitution : constitution,
                panNumber:panNumber,
                phoneNumber: phoneNumber,
                emailId: emailId,
                companyRegUrl: companyRegUrl,
                tdsExempted: tdsExempted,
                tdsDocumentUrl: tdsDocumentUrl,
                perAddress1:perAddress1,
                perAddress2: perAddress2,
                perState: perState,
                perDistrict: perDistrict,
                perCity: perCity,
                perpinCode: perpinCode,
                corAddress1:corAddress1,
                corAddress2:corAddress2,
                corState:corState,
                corDistrict: corDistrict,
                corCity: corCity,
                corpinCode: corpinCode,
                addressProofType: addressProofType,
                addProofurl: addProofurl,
                authSignName1: authSignName1,
                authSignDesignation1: authSignDesignation1,
                authSignPhNumber1: authSignPhNumber1,
                authSignAadhaar1: authSignAadhaar1,
                authSignProfilePicUrl1: authSignProfilePicUrl1,
                authSignSignatureUrl1: authSignSignatureUrl1, 
                authSignName2: authSignName2,
                authSignDesignation2: authSignDesignation2,
                authSignPhNumber2: authSignPhNumber2,
                authSignAadhaar2: authSignAadhaar2,
                authSignProfilePicUrl2: authSignProfilePicUrl2,
                authSignSignatureUrl2: authSignSignatureUrl2,
                authSigndocumentUrl: authSigndocumentUrl,
                bankAcctNumber: bankAcctNumber,
                bankName: bankName,
                bankAcctHolderName: bankAcctHolderName,
                bankIfscCode: bankIfscCode, 
                bankChequeUrl: bankChequeUrl,
                channelId: channelId,
                transId: transId, 
                agentId: agentId,
				authSignEmail1: authSignEmail1,
				authSignEmail2: authSignEmail2,
				perCountry: perCountry,
				corCountry: corCountry
            }, type: sequelize.QueryTypes.SELECT}
        ).then(results =>{
			
			if(results.length > 0 && paymentType == "NETBANKING" && transId) {
                logger.info ("after customer creation");
				var customerid = results[0].customerId;
				var Amount = String(depositAmount); 
				var transactionId = transId;
				var reqData =  {
					"dateTime":currentDate,
					"amount":Amount,
					"isMultiSettlement":"0",
					"custMobile":"9113898212",
					"apiKey":encryptkey,
					"productId":"DEFAULT",
					"instrumentId":"NA",
					"udf5":"NA",
					"cardType":"NA",
					"txnType":"DIRECT",
					"udf3":"NA",
					"udf4":"NA",
					"udf1":"true",
					"type":"1.0",
					"udf2":paymentType,
					"merchantId":reqMerchantId,
					"cardDetails":"NA",
					"custMail":"test@test.com",
					"returnURL":hdfcprodReturnUrl,
					"channelId":"0",
					"txnId":transactionId,
					"newCustomer":"true"
				};	
                    
                    var encrypt = crypto.createCipheriv('aes-256-cbc', encryptkey, encryptiv);
                    var theCipher = encrypt.update(JSON.stringify(reqData), 'utf8', 'base64');
                    theCipher += encrypt.final('base64');
		
			    rtgsDetails.build({
                    TRANSACTION_ID:transactionId,
                    CHANNEL:channelId,
                    FE_PAY_TYPE:paymentType,
                    PRODUCT_ID: productId, 
                    CUSTOMER_ID: customerid, 
                    PERIOD: period, 
                    INT_PAY_FREQUENCY: interestPayment, 
                    CATEGORY_ID: categoryId, 
                    RATE_OF_INT: rateOfInterest, 
                    MATURITY_AMOUNT: maturityAmount,
                    DEPOSIT_AMT:depositAmount,
                    CREATED_DT:currentDate
                }).save().then(results => {
                    logger.info("after pg insertion");
                    if(channelId=='app'){
                        
                        return res.status(200).send({
                            "responseCode":sucessCode,
                            "redirectUrl":newurl,
							"paymentType":paymentType,
							"merchantId":reqMerchantId,
                            "transactionId":transactionId,
							"customerId":customerid,
							"reqData":theCipher
                        });

                    } else {
                        return res.status(200).send({
                            "responseCode":sucessCode,
                            "redirectUrl":newurl,
                            "paymentType":paymentType,
                            "merchantId":reqMerchantId,
                            "transactionId":transactionId,
                            "customerId":customerid,
                            "reqData":theCipher,
                            "response":[{
                                "redirectUrl":newurl,
                                "paymentType":paymentType,
                                "merchantId":reqMerchantId,
                                "transactionId":transactionId,
                                "customerId":customerid,
                                "reqData":theCipher
                            }]
                        });
                    }
                }).catch(err => {
                    logger.error(err);
                    res.status(500).send({
                        message: err.message
                    });
                });
            
            } else if (results.length > 0 && paymentType == "RTGS" && transId) {
                var customerid = results[0].customerId;
                var resultTransactionId = transId;
                var amount2Words = word.convertNumberToWords(depositAmount);
                //var amount2Words = converter.toWords(depositAmount).replace(/[^a-zA-Z0-9]/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                
                rtgsDetails.build({
                    TRANSACTION_ID:resultTransactionId, 
                    PRODUCT_ID: productId,
                    CUSTOMER_ID: customerid,
                    FE_PAY_TYPE:paymentType, 
                    PERIOD: period,
                    INT_PAY_FREQUENCY: interestPayment,
                    CATEGORY_ID: categoryId, 
                    RATE_OF_INT: rateOfInterest, 
                    MATURITY_AMOUNT: maturityAmount,
                    CHANNEL:channelId,
                    DEPOSIT_AMT:depositAmount,
                    CREATED_DT:currentDate}
                ).save().then(anotherTask => {
                        return res.status(200).send({
                            "responseCode":sucessCode,
                            "paymentType":paymentType, 
                            "depositorName":companyName,
                            "scheme":productId,
                            "period":period,
                            "interestRate":rateOfInterest,
                            "frequency":interestPayment,
                            "beneficiaryAccountNumber":resultTransactionId,
                            "amounttoberemitted":depositAmount,
                            "amountinWords":amount2Words, 
                            "beneficiaryBank":BeneficiaryBank,
                            "ifscCode":IFSCCode, 
                            "nameofBeneficiaryAccount":NameofBeneficiaryAccount, 
                            "paymentReference":PaymentReference,
                            "response":[{
                                "paymentType":paymentType, 
                                "depositorName":companyName,
                                "scheme":productId,
                                "period":period,
                                "interestRate":rateOfInterest,
                                "frequency":interestPayment,
                                "beneficiaryAccountNumber":resultTransactionId,
                                "amounttoberemitted":depositAmount,
                                "amountinWords":amount2Words, 
                                "beneficiaryBank":BeneficiaryBank,
                                "ifscCode":IFSCCode, 
                                "nameofBeneficiaryAccount":NameofBeneficiaryAccount, 
                                "paymentReference":PaymentReference
                            }]
                        });    
                }).catch(err => {
					logger.error(err);
					res.status(500).send({
                        data:null,
                        message: err.message
                    });
                });
            } else {
                return res.status(500).send({
                    "responseCode":500,
                    "response":"Problem in Creating Customer"
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
        return res.status(400).send({
            "responseCode":badRequestcode,
            "response":responseMessage
        });
    }
}