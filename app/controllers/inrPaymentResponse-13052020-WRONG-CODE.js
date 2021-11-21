const db = require('../config/db.js');
const sequelize = require('sequelize');
var resultUpdate = db.response;
var resultPaymentUpdate = db.paymentResponse;
const moment = require('moment'); 

exports.neftResponse = (req,res) => {
    var {
            transactionId,remitterName,fromAccountNumber,fromBankName,    
            utr,virtualAccount,amount,transferMode,creditDateTime
    } = req.body;
	
	if (transferMode == 'IMPS'){
		var condition = 'transactionId && utr && virtualAccount && amount && transferMode && creditDateTime';
    }else{
		var condition = 'transactionId && remitterName && fromAccountNumber && fromBankName && utr && virtualAccount && amount && transferMode && creditDateTime';
    }
	creditDateTime = moment(creditDateTime).format('DD/MM/YYYY HH:mm:ss');
	console.log("date=="+creditDateTime);
		
    if(condition){
        db.sequelize.query('select utr_number as "utrNumber", bank_ref_id as "transactionId", transaction_id as "virtualAccountNumber" from pg_rtgs_neft_trans_details where utr_number =:utr and bank_ref_id =:transactionId and transaction_id =:virtualAccount',
            {replacements:{utr: utr, transactionId: transactionId, virtualAccount: virtualAccount },type: sequelize.QueryTypes.SELECT}
        ).then(results =>{
            console.log(results);
            if(results.length > 0){
                   return res.status(200).send({"transactionId":transactionId,"code":300,"status":"Duplicate"});
            } else {
                db.sequelize.query('select product_id,customer_id,period,int_pay_frequency,deposit_amt from pg_rtgs_neft_trans_details where transaction_id =:virtualAccount',
                    {replacements: {virtualAccount:virtualAccount},type: sequelize.QueryTypes.SELECT}
                ).then(results=>{
                    console.log(results);
                    if(results.length > 0){
                        var customerId = results[0].CUSTOMER_ID;
                        var productId = results[0].PRODUCT_ID;
                        var period = results[0].PERIOD;
                        var interestPayment = results[0].INT_PAY_FREQUENCY;
                        var depositAmount = results[0].DEPOSIT_AMT;
                            db.sequelize.query('SELECT get_curr_id (\'ACK_ID\', \'\') AS "acknowledgementId" from DUAL',{ type: sequelize.QueryTypes.SELECT}
                            ).then(results=>{
                                console.log(results);
                                if(results.length > 0){
                                    var date = new Date();
                                    var acknowledgementId = results[0].acknowledgementId;
                                    resultPaymentUpdate.build({CUST_ID:customerId,PURPOSE:'NEW_DEPOSIT',BRANCH_CODE:'01',CREATED_BY:'SYS',STATUS_BY:'SYS',
                                        INT_PAY_FREQUENCY:interestPayment,STATUS:'CREATED', CREATE_DT:date, DEPOSIT_AMT:amount,MULTIPLE_DEPOSIT:'N',REQ_CHANNEL:'Online',
                                        TYPE_OF_DEPOSIT:productId,ACKNWLDGE_DT:date, PERIOD_OF_DEPOSIT:period,ACKNWLDGE_ID:acknowledgementId}).save().then(results =>{ 
                                        console.log("insereted sucessfully");
                                        resultUpdate.update({FMS_REF_ID:acknowledgementId,UTR_NUMBER:utr,PAYMENT_METHOD:transferMode,
                                            SENDER_ACT_NO:fromAccountNumber,SENDER_BANK_NAME:fromBankName,SENDER_NAME:remitterName,BANK_REF_ID:transactionId,TXN_DATE_TIME:creditDateTime,RTGS_NEFT_AMT_RECEIVED:amount},{ where: { TRANSACTION_ID:virtualAccount}}).then(results =>{ 
                                       // return res.status(200).send({"message": "ok","responseCode":"200"});
									        return res.status(200).send({"transactionId":transactionId,"code":200,"status":"Success"});
                                        }).catch(err => {res.status(500).send({message: err.message || "Some error occurred "});});
                                    }).catch(err => {res.status(500).send({message: err.message || "Some error occurred "});});
                                } else {
                                    return res.status(404).send({"transactionId":transactionId,"code":404,"status":"acknowledgement details not found"})
                                }
                            }).catch(err => {res.status(500).send({message: err.message});});
                    } else {
                        return res.status(404).send({"transactionId":transactionId,"code":404,"status":"Virtual account details not found"});
                    }
                }).catch(err => {res.status(500).send({message: err.message});});
            }
        }).catch(err => {res.status(500).send({message: err.message});})
    } else {
            return res.status(200).send({"transactionId":transactionId,"code":400,"status":"Invalid input parameters"});
    }
}    
