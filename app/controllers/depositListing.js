const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {
    responseMessage,
    sucessCode,
    badRequestcode,
    resourceNotFoundcode,
    NoRecords
} = require('../config/env');

exports.depositList = (req, res) => {
    
    var {
        customerId,
        panNumber
    } = req.body;
  
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
    
    if(customerId && panNumber) {
        
		var query = 'select "accountNumber" as "depositNumber","openDate" as "depositDate", "depositAmount" as "depositAmt",\ trunc("annualInterest",2) as "interestAmt", FORMS_FILED_CNT as "noOfFormsFiled", AGGREGATE_AMT as "aggregateAmount" from \
		table (get_cust_fd_details(:customerId)) a join deposit_Acinfo b on a."accountNumber" = b.deposit_no\
		join customer c on b.cust_id = c.cust_id  \
		join table(get_form15_submit_details(:customerId)) d on b.cust_id = d.customer_id\
		where "customerId"=:customerId and (c.pan_number =:panNumber \
		OR c.tan_no = :panNumber) AND b.FIFTEENH_DECLARE = \'N\' AND b.TAX_DEDUCTIONS = \'Y\'\
		AND a."accountStatus" =\'NEW\' AND b.authorize_status = \'AUTHORIZED\'';
		              
        // db query to fetch results
        db.sequelize.query(query,{replacements:{customerId:customerId, panNumber:panNumber},type: sequelize.QueryTypes.SELECT}
        ).then(results =>{
            if(results.length > 0){
                return res.status(200).send({
                    "responseCode":sucessCode,
                    "response":results
                });
            } else {
                return res.status(200).send({
                    "responseCode":resourceNotFoundcode,
                    "response":NoRecords
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