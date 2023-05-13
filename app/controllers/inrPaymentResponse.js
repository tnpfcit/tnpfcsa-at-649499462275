const db = require('../config/db.js');
const sequelize = require('sequelize');
var device = require('express-device');
var resultUpdate = db.response;
const logger = require('../config/logger');
//var resultPaymentUpdate = db.paymentResponse;
const moment = require('moment'); 

exports.neftResponse = (req,res,err) => {
    var channelId = req.device.type.toUpperCase();    
    var {transactionId,remitterName,fromAccountNumber,fromBankName,utr,virtualAccount,amount,transferMode,creditDateTime} = req.body;
    remitterName = remitterName ? remitterName : null;
    fromAccountNumber = fromAccountNumber ? fromAccountNumber : null;
    fromBankName = fromBankName ? fromBankName : null;
    //var creditDateTime = moment(creditDateTime).format("DD-MMM-YYYY HH:mm:ss");
    logger.error(`${err.Status} || ${new Date()} || ${req.originalUrl} || ${JSON.stringify(req.body)} || ${req.ip} || ${req.protocol}`);
    logger.info("credittime"+ creditDateTime);
    //creditDateTime = String(creditDateTime);
	
	if(transactionId,remitterName,fromAccountNumber,fromBankName,utr,virtualAccount,amount,transferMode,creditDateTime){
       logger.info("first validation" +' '+ remitterName +'accountNumver' +' '+ fromAccountNumber +'utrnumber' +' '+ utr +'virnumber'+' '+virtualAccount +'transactionid'+' '+transactionId);
        db.sequelize.query('select fms_ref_id, utr_number,bank_ref_id,txn_date_time,created_dt,transaction_id,product_id,customer_id,period,int_pay_frequency,deposit_amt,rate_of_int from pg_rtgs_neft_trans_details where transaction_id =:virtualAccount',
            {replacements:{virtualAccount: virtualAccount },type: sequelize.QueryTypes.SELECT}
        ).then(results =>{
				logger.info("first query result="+JSON.stringify(results));
			if (results.length > 0) {
				var d1 = results[0].CREATED_DT;
				d1 = moment(d1).format('MM/DD/YYYY HH:mm:ss');
				var d2 = new Date();
				d2 = moment(d2).format('MM/DD/YYYY HH:mm:ss');
				var date1 = new Date(d1);
				var date2 = new Date(d2);
				var timeDiff = Math.abs(date2.getTime() - date1.getTime());
				var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
				var fmsRefId =  results[0].FMS_REF_ID;
				var utrNumber = results[0].UTR_NUMBER;
				var bankRefId = results[0].BANK_REF_ID;
				var transId = results[0].TRANSACTION_ID;
				var customerId = results[0].CUSTOMER_ID;
				var productId = results[0].PRODUCT_ID;
				var period = results[0].PERIOD;
				var interestPayment = results[0].INT_PAY_FREQUENCY;
				var depositAmount = results[0].DEPOSIT_AMT;
				var txnDateTime = results[0].TXN_DATE_TIME;
				var rateOfInterest = results[0].RATE_OF_INT;
				//creditDateTime = moment(creditDateTime).format('DD-MMM-YYYY');
				if(utrNumber == utr && bankRefId == transactionId && transId == virtualAccount){
					logger.info("utrNumber"+' '+utrNumber+' '+"utr"+' '+utr);
					logger.info("bankRefId"+' '+bankRefId+' '+"transactionId"+' '+transactionId);
					logger.info("transId"+' '+transId+' '+"virtualAccount"+' '+virtualAccount);
					return res.status(200).send({"transactionId":transactionId,"code":300,"status":"Duplicate"});
				} else if( diffDays > 2) {
					console.log("inside day condition check");
					return res.status(200).send({"transactionId":transactionId,"code":400,"status":"Payment window for this virtual account number is expired"});
				} else if(amount < 200000) {
					logger.info("inside amount condition check");
					return res.status(200).send({"transactionId":transactionId,"code":400,"status":"Transaction Rejected. Minimum acceptable payment amount is Rs. 2,00,000."});
				} else if (utrNumber == null && bankRefId == null && txnDateTime == null && fmsRefId == null){
					logger.info("insdide null check. Calling db function");
					db.sequelize.query('select api_rtgs_neft_payment_details(:transactionId,:customerId,:productId,:period,:interestPayment,:depositAmount,\
						:remitterName,:fromAccountNumber,:fromBankName,:utr,:virtualAccount,:amount,:transferMode,:creditDateTime,:channelId,:rateOfInterest) as "acknowledgementId" from dual',
						{replacements:{transactionId: transactionId,customerId: customerId,productId: productId,period: period,interestPayment: interestPayment,depositAmount: depositAmount,
						remitterName: remitterName, fromAccountNumber: fromAccountNumber,fromBankName: fromBankName,utr:utr,virtualAccount: virtualAccount,
						amount:amount,transferMode: transferMode,creditDateTime:creditDateTime, channelId: channelId, rateOfInterest: rateOfInterest},type:sequelize.QueryTypes.SELECT}
					).then(results=>{
						logger.info("function returning ackid as a result sucess" + JSON.stringify(results));
						var result = results[0].acknowledgementId;
							if(result == 'SUCCESS'){
								return res.status(200).send({"transactionId":transactionId,"code":200,"status":"Success"});
							} else {
								return res.status(200).send({"transactionId":transactionId,"code":500,"status":"Technical Error.Please try again."});
							} 
					}).catch(err => {res.status(500).send({message: err.message});
						   logger.error(err);
					   });
            } else {
                logger.info("virtual account");
                return res.status(200).send({"transactionId":transactionId,"code":400,"status":"Payment entry already exists for same Virtual Account Number"});  
            }
		} else {
			logger.info("first query didnt fetch result. Transaction id not matching");
			return res.status(200).send({"transactionId":transactionId,"code":400,"status":"Invalid Transaction Id. Virtual account number not matching with database value"});  
			
		}
        }).catch(err => {res.status(500).send({message: err.message});
            logger.error(err);
            });
    } else {
        return res.status(400).send({"transactionId":transactionId,"code":400,"status":"Invalid input parameters"});
    }
}