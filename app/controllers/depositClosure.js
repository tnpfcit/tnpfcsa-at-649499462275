const db = require('../config/db.js');
const sequelize = require('sequelize');
var urlencode = require('urlencode');
var device = require('express-device');
const MaskData = require('maskdata');
var logger = require('../config/logger');
var request = require('request');
let {
	responseMessage,
	sucessCode,
	resourceNotFoundcode,
	badRequestcode,
	username,
	hash,
	sender
} = require('../config/env');
exports.depositclosure = (req,res) =>{
	let channelId = req.device.type.toUpperCase();
	let agentId = 'SYS';
	let {
		customerId,
		depositNumber,
		purpose,
		renewCloseFdUrl,
		closureType
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
	closureType = closureType ? closureType : null;
	/* 
		converting array of objects into string separated by pipe symbol.
		multiple certificate uploads
	*/
	if (renewCloseFdUrl instanceof Array) {
		renewCloseFdUrl = renewCloseFdUrl.map(element => element.url).toString();
		renewCloseFdUrl = renewCloseFdUrl.replace(/\,/g, "|");
	}
		if(customerId && depositNumber && purpose){
			let query = 'select ACKNWLDGE_ID AS "acknowledgementId" FROM ACKNOWLEDGEMENT where  DEPOSIT_NUM =:depositNumber AND STATUS !=\'DELETED\' AND PURPOSE =\'CLOSURE\'';
				db.sequelize.query(query,{replacements:{depositNumber:depositNumber}, type: sequelize.QueryTypes.SELECT}
				).then(results =>{
					if(results.length == 0){
						db.sequelize.query('select depositClosure (:customerId, :depositNumber, :purpose, :renewCloseFdUrl, :channelId, :agentId, :closureType) as acknowledgementId from dual',
						  {replacements:{
							customerId: customerId,
							depositNumber: depositNumber,
							purpose: purpose,
							renewCloseFdUrl: renewCloseFdUrl,
							channelId: channelId,
							agentId: agentId,
							closureType: closureType
						}, type: sequelize.QueryTypes.SELECT}
						).then(results =>{
                        	let ackId = results[0].ACKNOWLEDGEMENTID;
                        	let query = 'select decode (cust_type,\'INDIVIDUAL\',fname,comp_name) "depositorName",cp.phone_number "phoneNumber" from customer c left join cust_phone cp on c.cust_id = cp.cust_id where c.cust_id =:customerId and PHONE_TYPE_ID = \'MOBILE\'';
                        	db.sequelize.query(query,{replacements:{customerId: customerId}, type: sequelize.QueryTypes.SELECT}
                        	).then(results =>{
								let acklast7Digits = ackId.substr(3,8);
                                let phoneNumber = results[0].phoneNumber;
                                let depositorName = results[0].depositorName.length>16? results[0].depositorName.substring(0,16):results[0].depositorName;
								let msg = urlencode('Dear '+depositorName+', Service Request No.ACK'+acklast7Digits+' for Deposit Closure has been received for processing.-TNPFIDC');
								let data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+phoneNumber+'&text='+msg+'&route=6';
								request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {});
                                //var msg = urlencode('Dear '+depositorName+', Your Service Request No. '+acknowledgementId+' for Deposit Closure has been received for processing. - Tamil Nadu Power Finance (TNPF)');
                                //var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
                                //request("https://api.textlocal.in/send?"+ data, (error, response, body) => {}); - done on dec 16 tnpfc 2211
                                return res.status(200).send({
									"responseCode":sucessCode,
									"response":{"acknowledgementId":ackId}
								});
                        	}).catch(err => {
								return res.status(500).send({
									data:null,
									message:err.message
								});
							});
						}).catch(err => {
							return res.status(500).send({
								data:null,
								message:err.message
							});
						});
					} else {
						let ackid = results[0].ACKNOWLEDGEMENTID;
						let query = 'select deposit_status "status" from deposit_acinfo where deposit_no =:depositNumber'
						db.sequelize.query(query,{replacements:{depositNumber:depositNumber}, type: sequelize.QueryTypes.SELECT}
						).then(results =>{
							if(results.length == 0 || results[0].status != 'CLOSED'){
								return res.status(200).send({
									"responseCode":sucessCode,
									"response": "Your Closure Request Reference No "+ ackid +" is being processed. Please wait and try again later."
								});
							} else {
								return res.status(200).send({
									"responseCode":sucessCode,
									"response": "Your Closure Request Reference No "+ ackid +" is already processed"
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
			return res.status(200).send({
				"responseCode":badRequestcode,
				"response":responseMessage
			});
		} 
}