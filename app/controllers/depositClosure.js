const db = require('../config/db.js');
const sequelize = require('sequelize');
var urlencode = require('urlencode');
var device = require('express-device');
const MaskData = require('maskdata');
var logger = require('../config/logger');
var request = require('request');
var {username,hash,sender} = require('../config/env.js');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode} = require('../config/env');

exports.depositclosure = (req,res) =>{
	var {customerId,depositNumber,purpose,renewCloseFdUrl,closureType} = req.body;
	var channelId = req.device.type.toUpperCase();
	var agentId = 'SYS';
	console.log(channelId);
	renewCloseFdUrl = renewCloseFdUrl ? renewCloseFdUrl : null;
	closureType = closureType ? closureType : null;
	if (renewCloseFdUrl instanceof Array) {
		renewCloseFdUrl = renewCloseFdUrl.map(element => element.url).toString();
		renewCloseFdUrl = renewCloseFdUrl.replace(/\,/g, "|");
	}
	console.log(renewCloseFdUrl);
    logger.info(
        `${new Date()} || 
         ${req.originalUrl} || 
         ${JSON.stringify(req.body)} || 
         ${req.ip} || 
         ${req.protocol}`
    );	
		if(customerId && depositNumber && purpose){
			var query = 'select ACKNWLDGE_ID AS "acknowledgementId" FROM ACKNOWLEDGEMENT where  DEPOSIT_NUM =:depositNumber AND STATUS !=\'DELETED\' AND PURPOSE =\'CLOSURE\'';
				db.sequelize.query(query,{replacements:{depositNumber:depositNumber}, type: sequelize.QueryTypes.SELECT}
				).then(results =>{
					if(results.length == 0){
						db.sequelize.query('select depositClosure (:customerId, :depositNumber, :purpose, :renewCloseFdUrl, :channelId, :agentId, :closureType) as acknowledgementId from dual',
						  {replacements:{customerId: customerId, depositNumber: depositNumber, purpose: purpose, renewCloseFdUrl: renewCloseFdUrl, channelId: channelId, agentId: agentId, closureType: closureType}, type: sequelize.QueryTypes.SELECT}
						).then(results =>{
							console.log(results);
                        	var ackId = results[0].ACKNOWLEDGEMENTID;
                        	var query = 'select decode (cust_type,\'INDIVIDUAL\',fname,comp_name) "depositorName",cp.phone_number "phoneNumber" from customer c left join cust_phone cp on c.cust_id = cp.cust_id where c.cust_id =:customerId';
                        	db.sequelize.query(query,{replacements:{customerId: customerId}, type: sequelize.QueryTypes.SELECT}
                        	).then(results =>{
                                console.log("ackId" + ackId);
                                var acknowledgementId = ackId;
                                var phoneNumber = results[0].phoneNumber;
                                var depositorName = results[0].depositorName.length>16? results[0].depositorName.substring(0,16):results[0].depositorName;
                                var msg = urlencode('Dear '+depositorName+', Your Service Request No. '+acknowledgementId+' for Deposit Closure has been received by TN Power Finance for processing');
                                var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
                                request("https://api.textlocal.in/send?"+ data, (error, response, body) => {});
                                return res.status(200).send({"responseCode":sucessCode, "response":{"acknowledgementId":acknowledgementId}});
                        	}).catch(err => {res.status(500).send({message: err.message});});
						}).catch(err => {res.status(500).send({response:null,message:err.message});});
					} else {
						var ackid = results[0].acknowledgementId;
						var query = 'select ACKNWLDGE_ID "acknowledgementId" from deposit_acinfo where deposit_no =:depositNumber'
						db.sequelize.query(query,{replacements:{depositNumber:depositNumber}, type: sequelize.QueryTypes.SELECT}
						).then(results =>{
							if(results.length == 0 || results[0].acknowledgementId == null){
								return res.status(200).send({"responseCode":sucessCode, "response": "Your Closure Request Reference No "+ ackid +" is waiting for processing. Please try again later."});
							} else {
								return res.status(200).send({"responseCode":sucessCode, "response": "Your Closure Request Reference No "+ ackid +" is already processed"});
							}
						}).catch(err => {res.status(500).send({message: err.message});});		
					} 
				}).catch(err => {res.status(500).send({message: err.message});});  
		} else {
			return res.status(400).send({"responseCode":badRequestcode,"response":responseMessage});
		} 
}