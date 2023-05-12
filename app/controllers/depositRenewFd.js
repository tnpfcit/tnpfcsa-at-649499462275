const db = require('../config/db.js');
const sequelize = require('sequelize');
var urlencode = require('urlencode');
const MaskData = require('maskdata');
var device = require('express-device');
var request = require('request');
var logger = require('../config/logger');
var {username,hash,sender} = require('../config/env.js');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode} = require('../config/env');
 
exports.depositRenewFd1 = (req,res) =>{

    var channelId = req.device.type.toUpperCase();
    var agentId = 'SYS';
    
    var {
        customerId,
        depositNumber,
        purpose,
        withDrawalAmt,
        newDepositAmt,
        depositTenure,
        depositPayFrequency,
        prodId,
        renewCloseFdUrl,
        nomineeName,
        nomineeDob,
        nomineeRelationship,
        guardianName,
        guardianRelationship,
        depositType,
        jointHolderName,
        bankAcctNumber,
        bankName,
        bankAcctHolderName,
        bankIfscCode,
		renewType,
		depositType,
		bankChequeUrl,
		jointHolder2Name
    } = req.body;
	
	if(newDepositAmt < 200000){
		return res.status(500).send({"responseCode":"500","response":"Deposit Amount Should not be less than Rs. 2,00,000"});
	}


    renewCloseFdUrl = renewCloseFdUrl ? renewCloseFdUrl : null;
    nomineeName = nomineeName ? nomineeName  : null;
	nomineeDob = nomineeDob  ? nomineeDob  : null;
	nomineeRelationship = nomineeRelationship ? nomineeRelationship : null;
    guardianName = guardianName ? guardianName : null;
    guardianRelationship = guardianRelationship ? guardianRelationship : null;
    jointHolderName = jointHolderName ? jointHolderName : null;
	jointHolder2Name = jointHolder2Name ? jointHolder2Name : null;
	renewType = renewType ? renewType : null;
	bankChequeUrl = bankChequeUrl ? bankChequeUrl : null;

        if (renewCloseFdUrl instanceof Array) {
            renewCloseFdUrl = renewCloseFdUrl.map(element => element.url).toString();
            renewCloseFdUrl = renewCloseFdUrl.replace(/\,/g, "|");
        }
      
        logger.info(`
            ${new Date()} || 
			${req.originalUrl} || 
			${JSON.stringify(req.body)} || 
			${req.ip} || 
			${req.protocol}`
        );
        	   
        if(prodId && customerId && depositNumber && purpose && newDepositAmt && depositTenure && ((prodId =='202' && depositPayFrequency == 0) || (prodId =='201' && depositPayFrequency > 0))){
        //if(customerId && depositNumber && purpose && newDepositAmt && depositTenure && depositPayFrequency && prodId){
            var query = 'select ACKNWLDGE_ID AS "acknowledgementId" FROM ACKNOWLEDGEMENT where DEPOSIT_NUM =:depositNumber AND STATUS !=\'DELETED\' AND PURPOSE = \'RENEWAL\'';	
            db.sequelize.query(query,{replacements:{depositNumber: depositNumber}, type: sequelize.QueryTypes.SELECT}
            ).then(results =>{
                if(results.length == 0){
                    db.sequelize.query('select depositRenew_v2 (:customerId, :depositNumber, :purpose, :withDrawalAmt, :newDepositAmt, :depositTenure, :depositPayFrequency, :prodId, :channelId, :renewCloseFdUrl, :agentId,:nomineeName,:nomineeDob,:nomineeRelationship,:guardianName,:guardianRelationship,:depositType,:jointHolderName,\
                        :bankAcctNumber,:bankName,:bankAcctHolderName,:bankIfscCode,:bankChequeUrl,:renewType,:jointHolder2Name) as acknowledgementId from dual',
                        {replacements:{
                            customerId: customerId, 
                            depositNumber: depositNumber, 
                            purpose: purpose, 
                            withDrawalAmt:withDrawalAmt, 
                            newDepositAmt:newDepositAmt, 
                            depositTenure:depositTenure, 
                            depositPayFrequency:depositPayFrequency, 
                            prodId:prodId, 
                            channelId: channelId, 
                            renewCloseFdUrl: renewCloseFdUrl, 
                            agentId: agentId,
                            nomineeName: nomineeName, 
                            nomineeDob: nomineeDob, 
                            nomineeRelationship: nomineeRelationship,
                            guardianName: guardianName,
                            guardianRelationship: guardianRelationship,
                            depositType: depositType,
                            jointHolderName: jointHolderName,
                            bankAcctNumber: bankAcctNumber, 
                            bankName: bankName, 
                            bankAcctHolderName: bankAcctHolderName, 
                            bankIfscCode: bankIfscCode,
							bankChequeUrl:bankChequeUrl,
							renewType:renewType,
							jointHolder2Name: jointHolder2Name
                        }, type: sequelize.QueryTypes.SELECT}
                    ).then(results =>{
                        console.log(results);
                        var ackId = results[0].ACKNOWLEDGEMENTID;
                        var query = 'select decode (cust_type,\'INDIVIDUAL\',fname,comp_name) "depositorName",cp.phone_number "phoneNumber" from customer c left join cust_phone cp on c.cust_id = cp.cust_id where c.cust_id =:customerId';
                        db.sequelize.query(query,{replacements:{customerId: customerId}, type: sequelize.QueryTypes.SELECT}
                        ).then(results =>{
                                let acklast7Digits = ackId.substr(3,8);
                                var phoneNumber = results[0].phoneNumber;
                                var depositorName = results[0].depositorName.length>16? results[0].depositorName.substring(0,16):results[0].depositorName;
								var msg = urlencode('Dear '+depositorName+', Service Request No.ACK'+acklast7Digits+' for Deposit Renewal has been received for processing.-TNPFIDC');
								var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+phoneNumber+'&text='+msg+'&route=6';
								request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {});
                                //var msg = urlencode('Dear '+depositorName+', Your Service Request No. '+acknowledgementId+' for Deposit Renewal has been received for processing. - Tamil Nadu Power Finance (TNPF)');
                                //var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
                                //request("https://api.textlocal.in/send?"+ data, (error, response, body) => {}); - done on dec 16 tnpfc 2211
                                return res.status(200).send({"responseCode":sucessCode, "response":{"acknowledgementId":ackId}});
                        }).catch(err => {res.status(500).send({message: err.message});});
                    }).catch(err => {res.status(500).send({message: err.message});});
                } else {
                    var ackid = results[0].acknowledgementId;
					var query = 'select ACKNWLDGE_ID AS "acknowledgementId" from deposit_acinfo where DEPOSIT_NO =:depositNumber';
                    db.sequelize.query(query,{replacements:{depositNumber:depositNumber}, type: sequelize.QueryTypes.SELECT}
                    ).then(results =>{
                        if(results.length == 0 || results[0].acknowledgementId == null){
                            return res.status(200).send({"responseCode":sucessCode, "response": "Your Renewal Request Reference No "+ ackid +" is waiting for processing. Please try again later."});
						} else {
                            return res.status(200).send({"responseCode":sucessCode, "response": "Your Renewal Request Reference No  "+ ackid +" is already processed"});
						}
                    }).catch(err => {res.status(500).send({message: err.message});});		
                } 
            }).catch(err => {res.status(500).send({message: err.message});});  
        } else {
            return res.status(400).send({"responseCode":badRequestcode,"response":responseMessage});
        } 
}

exports.depositRenewFd = (req,res) =>{
    
    var channelId = req.device.type.toUpperCase();
    var agentId = 'SYS';
    var {
        customerId,
        depositNumber,
        purpose,
        withDrawalAmt,
        newDepositAmt,
        depositTenure,
        depositPayFrequency,
        prodId,
        renewCloseFdUrl,
        nomineeName,
        nomineeDob,
        nomineeRelationship,
        guardianName,
        guardianRelationship,
        depositType,
        jointHolderName,
        bankAcctNumber,
        bankName,
        bankAcctHolderName,
        bankIfscCode
    } = req.body;

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);

    renewCloseFdUrl = renewCloseFdUrl ? renewCloseFdUrl : null;

    if (renewCloseFdUrl instanceof Array) {
        renewCloseFdUrl = renewCloseFdUrl.map(element => element.url).toString();
        renewCloseFdUrl = renewCloseFdUrl.replace(/\,/g, "|");
    }
	
    if(prodId && customerId && depositNumber && purpose && newDepositAmt && depositTenure && ((prodId =='202' && depositPayFrequency == 0) || (prodId =='201' && depositPayFrequency > 0))){

        var query = 'select ACKNWLDGE_ID AS "acknowledgementId" FROM ACKNOWLEDGEMENT where DEPOSIT_NUM =:depositNumber AND STATUS =\'CREATED\' AND PURPOSE = \'RENEWAL\'';	
        
        db.sequelize.query(query,{replacements:{depositNumber: depositNumber}, type: sequelize.QueryTypes.SELECT}
        ).then(results =>{
            if(results.length == 0){
                
                db.sequelize.query('select depositRenew (:customerId, :depositNumber, :purpose, :withDrawalAmt, :newDepositAmt, :depositTenure, :depositPayFrequency, :prodId, :channelId, :renewCloseFdUrl, :agentId) as acknowledgementId from dual',
                        {replacements:{
                            customerId: customerId, 
                            depositNumber: depositNumber, 
                            purpose: purpose, 
                            withDrawalAmt:withDrawalAmt, 
                            newDepositAmt:newDepositAmt, 
                            depositTenure:depositTenure, 
                            depositPayFrequency:depositPayFrequency, 
                            prodId:prodId, 
                            channelId: channelId, 
                            renewCloseFdUrl: renewCloseFdUrl,
                            agentId: agentId
                        }, type: sequelize.QueryTypes.SELECT}
                ).then(results =>{
                    
                    var ackId = results[0].ACKNOWLEDGEMENTID;
                    var query = 'select decode (cust_type,\'INDIVIDUAL\',fname,comp_name) "depositorName",cp.phone_number "phoneNumber" from customer c left join cust_phone cp on c.cust_id = cp.cust_id where c.cust_id =:customerId';
                    db.sequelize.query(query,{replacements:{customerId: customerId}, type: sequelize.QueryTypes.SELECT}
                    ).then(results =>{ 
						let acklast7Digits = ackId.substr(3,8);
						var phoneNumber = results[0].phoneNumber;
						var depositorName = results[0].depositorName.length>16? results[0].depositorName.substring(0,16):results[0].depositorName;
						var msg = urlencode('Dear '+depositorName+', Service Request No.ACK'+acklast7Digits+' for Deposit Renewal has been received for processing.-TNPFIDC');
						var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+phoneNumber+'&text='+msg+'&route=6';
						request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {});
                        //var msg = urlencode('Dear '+depositorName+', Your Service Request No. '+acknowledgementId+' for Deposit Renewal has been received for processing. - Tamil Nadu Power Finance (TNPF)');
                        //var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
                        //request("https://api.textlocal.in/send?"+ data, (error, response, body) => {}); - done on dec 16 tnpfc 2211
                        return res.status(200).send({
                            "responseCode":sucessCode, 
                            "response":{
                                "acknowledgementId":ackId
                            }
                        });
                    }).catch(err => {
                        return res.status(500).send({
                            data:null,
                            message: err.message
                        });
                    });
                }).catch(err => {
                    return res.status(500).send({
                        data:null,
                        message: err.message
                    });
                });
            } else {
                
                var ackid = results[0].acknowledgementId;
				var query = 'select ACKNWLDGE_ID AS "acknowledgementId" from deposit_acinfo where DEPOSIT_NO =:depositNumber';
                
                db.sequelize.query(query,{replacements:{depositNumber:depositNumber}, type: sequelize.QueryTypes.SELECT}
                ).then(results =>{
                    if(results.length == 0 || results[0].acknowledgementId == null){
                        return res.status(200).send({
                            "responseCode":sucessCode, 
                            "response": "Your Renewal Request Reference No "+ ackid +" is waiting for processing. Please try again later."
                        });
					} else {
                        return res.status(200).send({
                            "responseCode":sucessCode, 
                            "response": "Your Renewal Request Reference No  "+ ackid +" is already processed"
                        });
					}
                }).catch(err => {
                    return res.status(500).send({
                        data:null,
                        message: err.message
                    });
                });		
            } 
        }).catch(err => {
            return res.status(500).send({
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

/*const db = require('../config/db.js');
const sequelize = require('sequelize');
var urlencode = require('urlencode');
const MaskData = require('maskdata');
var device = require('express-device');
var request = require('request');
const logger = require('../config/logger.js');
var {
    username,
    hash,
    sender,
    responseMessage,
    sucessCode,
    resourceNotFoundcode,
    badRequestcode
} = require('../config/env');
 
exports.depositRenewFd = (req,res) =>{
    
    var channelId = req.device.type.toUpperCase();
    var agentId = 'SYS';
    var {
        customerId,
        depositNumber,
        purpose,
        withDrawalAmt,
        newDepositAmt,
        depositTenure,
        depositPayFrequency,
        prodId,
        renewCloseFdUrl
    } = req.body;

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);

    renewCloseFdUrl = renewCloseFdUrl ? renewCloseFdUrl : null;

    if (renewCloseFdUrl instanceof Array) {
        renewCloseFdUrl = renewCloseFdUrl.map(element => element.url).toString();
        renewCloseFdUrl = renewCloseFdUrl.replace(/\,/g, "|");
    }
	
    if(prodId && customerId && depositNumber && purpose && newDepositAmt && depositTenure && ((prodId =='202' && depositPayFrequency == 0) || (prodId =='201' && depositPayFrequency > 0))){

        var query = 'select ACKNWLDGE_ID AS "acknowledgementId" FROM ACKNOWLEDGEMENT where DEPOSIT_NUM =:depositNumber AND STATUS =\'CREATED\' AND PURPOSE = \'RENEWAL\'';	
        
        db.sequelize.query(query,{replacements:{depositNumber: depositNumber}, type: sequelize.QueryTypes.SELECT}
        ).then(results =>{
            if(results.length == 0){
                
                db.sequelize.query('select depositRenew (:customerId, :depositNumber, :purpose, :withDrawalAmt, :newDepositAmt, :depositTenure, :depositPayFrequency, :prodId, :channelId, :renewCloseFdUrl, :agentId) as acknowledgementId from dual',
                        {replacements:{
                            customerId: customerId, 
                            depositNumber: depositNumber, 
                            purpose: purpose, 
                            withDrawalAmt:withDrawalAmt, 
                            newDepositAmt:newDepositAmt, 
                            depositTenure:depositTenure, 
                            depositPayFrequency:depositPayFrequency, 
                            prodId:prodId, 
                            channelId: channelId, 
                            renewCloseFdUrl: renewCloseFdUrl,
                            agentId: agentId
                        }, type: sequelize.QueryTypes.SELECT}
                ).then(results =>{
                    
                    var ackId = results[0].ACKNOWLEDGEMENTID;
                    var query = 'select c.fname "depositorName",cp.phone_number "phoneNumber" from customer c left join cust_phone cp on c.cust_id = cp.cust_id where c.cust_id =:customerId';
                    
                    db.sequelize.query(query,{replacements:{customerId: customerId}, type: sequelize.QueryTypes.SELECT}
                    ).then(results =>{
                               
                        var acknowledgementId = ackId;
                        var phoneNumber = results[0].phoneNumber;
                        var depositorName = results[0].depositorName.length>16? results[0].depositorName.substring(0,16):results[0].depositorName;
                        var msg = urlencode('Dear '+depositorName+', Your Service Request No. '+acknowledgementId+' for Deposit Renewal has been received for processing. - Tamil Nadu Power Finance (TNPF)');
                        var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
                        request("https://api.textlocal.in/send?"+ data, (error, response, body) => {});
                        
                        return res.status(200).send({
                            "responseCode":sucessCode, 
                            "response":{
                                "acknowledgementId":acknowledgementId
                            }
                        });
                    }).catch(err => {
                        return res.status(500).send({
                            data:null,
                            message: err.message
                        });
                    });
                }).catch(err => {
                    return res.status(500).send({
                        data:null,
                        message: err.message
                    });
                });
            } else {
                
                var ackid = results[0].acknowledgementId;
				var query = 'select ACKNWLDGE_ID AS "acknowledgementId" from deposit_acinfo where DEPOSIT_NO =:depositNumber';
                
                db.sequelize.query(query,{replacements:{depositNumber:depositNumber}, type: sequelize.QueryTypes.SELECT}
                ).then(results =>{
                    if(results.length == 0 || results[0].acknowledgementId == null){
                        return res.status(200).send({
                            "responseCode":sucessCode, 
                            "response": "Your Renewal Request Reference No "+ ackid +" is waiting for processing. Please try again later."
                        });
					} else {
                        return res.status(200).send({
                            "responseCode":sucessCode, 
                            "response": "Your Renewal Request Reference No  "+ ackid +" is already processed"
                        });
					}
                }).catch(err => {
                    return res.status(500).send({
                        data:null,
                        message: err.message
                    });
                });		
            } 
        }).catch(err => {
            return res.status(500).send({
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
*/