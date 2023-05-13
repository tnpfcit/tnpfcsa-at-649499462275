const db = require('../config/db.js');
const sequelize = require('sequelize');
var aes256 = require('aes256');
const cryptoJSON = require('crypto-json');
var logger = require('../config/logger');
const crypto = require("crypto");
var microtime = require('microtime');
const fs = require('fs');
const path = require('path');
var hdfc = db.response;
var nomineeDetails = db.customernominee;
var {existurl,sucessCode,responseMessage,badRequestcode} = require('../config/env.js');  

exports.paymentResponse = (req, res, err) => {
	var key = "5M51M4KG6KG3BN4PBWNAD9BCTLDMK29H";
    var iv = "5M51M4KG6KG3BN4P";
	var appkey = "SBN59A2O0WBZLULJSBN59A2O0WBZLULJ";
    var appiv = "SBN59A2O0WBZLULJ";
    var appmerchantId = "M00035";
	var iosappkey="rC2sB0pl2UY4Zb0TR0cC6EH7Um5QF6ek";
	var iosappiv="rC2sB0pl2UY4Zb0T";
	var iosmerchantid ="M00093";
	
    var responseData = req.body.respData;
    var id = req.body.merchantId;
	id = id ? id : null; 
    logger.info("responsedata======="+ responseData);
	logger.info(`${new Date()} || ${req.originalUrl} || ${JSON.stringify(req.body)} || ${req.ip} || ${req.protocol}`);
    if(responseData){
        logger.info("appkey=============="+ appkey);
        logger.info("appiv================"+ appiv);
		logger.info("portalkey=============="+ key);
		logger.info("portaliv============="+ iv);
        logger.info("id=========="+ id);
        
        if(id == appmerchantId){
            logger.info("this is mobile application api keys is used for decryption ========");
            key = appkey;
            iv = appiv;
        }else if (id == iosmerchantid)
        {
			key = iosappkey;
            iv = iosappiv;
        }
    // code for decrypting
        let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(responseData, 'base64', 'utf8');
        decrypted  += decipher.final('utf8');
        logger.info("decryption data from payment gateway ~~~~~~"+decrypted);
    // parsed decrypted data starts
        var decryptedData = JSON.parse(decrypted);
        var txnid = decryptedData.txn_id;
        var txn_status = decryptedData.trans_status;
        var newCustomer = decryptedData.udf1;
		var paymentType = decryptedData.udf2;
		logger.info("===================new"+ newCustomer);
                
        db.sequelize.query('select product_id as "productId",category_id as "categoryId",customer_id as "customerId",period as "period",rate_of_int as "rateOfInterest",int_pay_frequency as "interestPayment",maturity_amount as "maturityAmount", deposit_amt as "depositAmount"\
        from pg_rtgs_neft_trans_details where TRANSACTION_ID =:txnid and STATUS IS NULL and PG_REF_ID IS NULL and BANK_REF_ID IS NULL AND FE_PAY_TYPE = \'NETBANKING\'',
            {replacements: {txnid:txnid},type:sequelize.QueryTypes.SELECT}
        ).then(results => {
            if(results.length > 0){
                var productId = results[0].productId;
                var customerId = results[0].customerId;
                var categoryId = results[0].categoryId;
                var period = results[0].period;
                var interestPayment = results[0].interestPayment;
                var rateOfInterest = results[0].rateOfInterest;
                var maturityAmount = results[0].maturityAmount;
                var depositAmount = results[0].depositAmount;
                var startDate = "";
                var maturityDate = "";
                var interestAmount = (results[0].maturityAmount-results[0].depositAmount);
                var depositNumber;
                    if (txn_status == 'Ok'){
                        db.sequelize.query('select DEPOSIT_OPENING_API (:productId, :customerId, :categoryId, :period, :interestPayment, :depositAmount,\
                            :rateOfInterest, :maturityAmount, :startDate, :maturityDate, :interestAmount, :newCustomer,:txnid ) AS "depositNumber" from dual',
                            {replacements: {productId: productId, customerId: customerId, categoryId: categoryId, period: period, interestPayment: interestPayment, 
                            depositAmount: depositAmount, rateOfInterest: rateOfInterest, maturityAmount: maturityAmount, startDate: startDate, 
                            maturityDate: maturityDate, interestAmount: interestAmount,newCustomer: newCustomer, txnid: txnid }, type: sequelize.QueryTypes.SELECT }
                        ).then(results =>{
                            depositNumber = results[0].depositNumber;
                            hdfc.update({ PG_REF_ID: decryptedData.pg_ref_id, BANK_REF_ID: decryptedData.bank_ref_id ,TXN_DATE_TIME: decryptedData.txn_date_time , 
                                STATUS: decryptedData.trans_status, RESPONSE_CODE: decryptedData.resp_code, RESPONSE_MESSAGE: decryptedData.resp_message,
                                ACCT_NUM: depositNumber},{ where: { TRANSACTION_ID: txnid}}).then(results =>{ 
                                    if(newCustomer == "true") {
                                              
                                        nomineeDetails.update({ DEPOSIT_NO: depositNumber},{ where: { CUST_ID: customerId,DEPOSIT_NO: null}}).then(results => {
											   res.redirect('https://www.tnpowerfinance.com/tnpfc-web/paymentpage?transactionId=' + txnid + '&paymentType=' + paymentType);	
											   
										}).catch(err => {res.status(500).send({message: err.message});}); 											   
                                    } else {
                                               res.redirect('https://www.tnpowerfinance.com/tnpfc-db/paymentpage?transactionId=' + txnid + '&paymentType=' + paymentType );
                                    }
                                         
                            }).catch(err => {res.status(500).send({message: err.message});});
                        }).catch(err => {res.status(500).send({ message: err.message});});
                    } else {
                        hdfc.update({ PG_REF_ID: decryptedData.pg_ref_id, BANK_REF_ID: decryptedData.bank_ref_id ,TXN_DATE_TIME: decryptedData.txn_date_time , 
                            STATUS: decryptedData.trans_status, RESPONSE_CODE: decryptedData.resp_code, RESPONSE_MESSAGE: decryptedData.resp_message},{ where: { TRANSACTION_ID: txnid}}
                        ).then(results =>{ 
                                if(newCustomer == "true") {
                                               res.redirect('https://www.tnpowerfinance.com/tnpfc-web/paymentpage?transactionId=' + txnid + '&paymentType=' + paymentType); 				
                                } else {
                                               res.redirect('https://www.tnpowerfinance.com/tnpfc-db/paymentpage?transactionId=' + txnid + '&paymentType=' + paymentType);
                                }
                        }).catch(err => {res.status(500).send({message: err.message});});
                    }     
                           
            } else {
                return res.status(200).send({"responseCode":200,"message": "Invalid / Duplicate Transaction Id"});
            }
        }).catch(err => { res.status(500).send({message: err.message});});
    } else {
        return res.status(400).send({"responseCode":400, "response":"Bad request check payment gateway data"});
    }
}
  