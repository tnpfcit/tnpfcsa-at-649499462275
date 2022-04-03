const db = require('../config/db.js');
const sequelize = require('sequelize');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode,NoRecords} = require('../config/env');

exports.findAll = (req, res) => {
	let customerId = req.body.customerId;
	if(customerId){
		db.sequelize.query('select customerId AS "customerId", guardianName AS "guardianName", depositNumber AS "depositNumber",nomineeName AS "nomineeName",relationship AS "relationship", nomineeIsMinor AS "nomineeIsMinor", nomineePhoneNumber AS "nomineePhoneNumber", guardianRelationship AS "guardianRelationship",guardianPhoneNumber AS "guardianPhoneNumber" from api_getCustomerNominees  WHERE customerId =:customerId',
		{ replacements: {customerId: customerId }, type: sequelize.QueryTypes.SELECT }
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
					"response":[],
					"message":NoRecords
					});
				}
		  }).catch(err => {
				logger.error(err);
				return res.status(500).send({
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
  
 
  
  