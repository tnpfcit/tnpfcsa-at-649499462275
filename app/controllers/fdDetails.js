const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode,NoRecords} = require('../config/env');

exports.depositDetails = (req, res, err) => {
	let customerId = req.body.customerId;
	logger.info(`
		${new Date()} || 
		${req.originalUrl} || 
		${JSON.stringify(req.body)} || 
		${req.ip} || 
		${req.protocol} || 
		${req.method}
	`);
	if(customerId){
		var query = 'select "accountNumber", "productDesc", "productId", "openDate",\
		"maturityDate", "interestAmount", "annualInterest", "interestRatePercent",\
		"depositAmount", "maturityAmount", "productAliasName", "accountStatus",\
		"eFdrUrl", "depositAccountType" from table (get_cust_fd_details(:customerId)) where "customerId"=:customerId'; 
		db.sequelize.query(query,{replacements: {customerId:customerId },type: sequelize.QueryTypes.SELECT}
		).then(results => {
			if(results.length>0){
				return res.status(200).send({
				"responseCode":sucessCode,
				"response":results
				});
			}
			else{
				return res.status(200).send({
				"responseCode":resourceNotFoundcode,
				"response":NoRecords
				}); 
			}
		}).catch(err => {
			logger.error("fd query results error ======"+ err);
			res.status(500).send({
			data:null,
			message: err.message
			});
		});
	}else{
		return res.status(200).send({
        "responseCode":badRequestcode,
        "response":responseMessage
      }); 
	}
}