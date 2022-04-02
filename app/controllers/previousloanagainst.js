const db = require('../config/db.js');
const sequelize = require('sequelize');
var urlencode = require('urlencode');
const MaskData = require('maskdata');
var request = require('request');
var {username,hash,sender} = require('../config/env.js');
 
 
 exports.depositLoan = (req,res) =>{
	var channelId = req.device.type.toUpperCase();
	var agentId = 'SYS';
	var {customerId,depositNumber,purpose,loanAmt} = req.body;
	if(customerId && depositNumber && purpose && loanAmt){
		var query = 'select ACKNWLDGE_ID AS "acknowledgementId" FROM ACKNOWLEDGEMENT where DEPOSIT_NUM =:depositNumber AND STATUS =\'CREATED\' AND PURPOSE = \'LOAN_OPEN\'';
		db.sequelize.query(query,{replacements:{depositNumber: depositNumber}, type: sequelize.QueryTypes.SELECT}
		).then(results =>{
			if(results == 0){
				db.sequelize.query('select loanAgainstDeposit (:customerId, :depositNumber, :purpose, :loanAmt) as acknowledgementId from dual',
					{replacements:{customerId: customerId, depositNumber: depositNumber, purpose: purpose, loanAmt:loanAmt}, type: sequelize.QueryTypes.SELECT}
				).then(results =>{
					console.log(results);
                    var ackId = results[0].ACKNOWLEDGEMENTID;
                    var query = 'select c.fname "depositorName",cp.phone_number "phoneNumber" from customer c left join cust_phone cp on c.cust_id = cp.cust_id where c.cust_id =:customerId';
                    db.sequelize.query(query,{replacements:{customerId: customerId}, type: sequelize.QueryTypes.SELECT}
                    ).then(results =>{
                        console.log("ackId" + ackId);
                        var acknowledgementId = ackId;
                        var phoneNumber = results[0].phoneNumber;
                        var depositorName = results[0].depositorName.length>16? results[0].depositorName.substring(0,16):results[0].depositorName;
                        var msg = urlencode('Dear '+depositorName+', Your Service Request No. '+acknowledgementId+' for Loan has been received by TN Power Finance for processing');
                        var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
                        request("https://api.textlocal.in/send?"+ data, (error, response, body) => {});
                        return res.status(200).send({"responseCode":200, "response":{"acknowledgementId":acknowledgementId}});
					}).catch(err => {res.status(500).send({message: err.message});});
				}).catch(err => {res.status(500).send({message: err.message});});
			} else {
				var ackid = results[0].acknowledgementId;
				var query = 'select ACKNWLDGE_ID AS "acknowledgementId" from deposit_acinfo where DEPOSIT_NO =:depositNumber';
				db.sequelize.query(query,{replacements:{depositNumber:depositNumber}, type: sequelize.QueryTypes.SELECT}
				).then(results =>{
					if(results.length == 0 || results[0].acknowledgementId == null){
						return res.status(200).send({"responseCode":200, "response": "Your Loan Request Reference No "+ ackid +" is waiting for processing. Please try again later."});
					} else {
						return res.status(200).send({"responseCode":200, "response": "Your Loan Request Reference No  "+ ackid +" is already processed"});
					}
				}).catch(err => {res.status(500).send({message: err.message});});		
			} 
		}).catch(err => {res.status(500).send({message: err.message});});  
	} else {
		return res.status(400).send({"responseCode":400,"response":response.responseMessage});
	} 
}
 







 