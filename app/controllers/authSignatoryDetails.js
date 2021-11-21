const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {
    sucessCode,
    badRequestcode,
    resourceNotFoundcode,
    NoRecords,
    responseMessage
} = require('../config/env.js');

exports.nonIndividualSignatory = (req,res) => {
    
    var customerId = req.body.customerId;

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);

    if(customerId) {
        
        var query = 'select aadhar_no "aadharNumber", auth_sign_name "name", designation "designation", phone_no "phoneNumber", sequence_no "sequenceNumber", email_id "emailId", photo_url "photoUrl"from corp_auth_cust where cust_id =:customerId';
       
        // db query to fetch results
        db.sequelize.query(query,{replacements:{customerId:customerId},type: sequelize.QueryTypes.SELECT}
        ).then(results =>{
            
            if(results.length > 0){
                return res.status(200).send({
                    "responseCode":sucessCode,
                    "response":results
                });
            } else {
                return res.status(200).send({
                    "responseCode":resourceNotFoundcode,
                    "response":[]
                });
            }
        }).catch(err => {
            logger.error(err);
            return res.status(500).send({
                data:null,
                message:err.message
            });
        });
    } else {
        // validation for request
        return res.status(200).send({
            "responseCode":badRequestcode,
            "response":responseMessage
        });
    }
}