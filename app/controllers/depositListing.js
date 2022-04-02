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
        
        var query ='select da.deposit_no "depositNumber", dsa.deposit_dt "depositDate", dsa.deposit_amt "depositAmt", ROUND (dsa.tot_int_amt / (deposit_period_mm / 12)) "interestAmt"  from customer c\
        join deposit_acinfo da on c.cust_id = da.cust_id AND da.FIFTEENH_DECLARE = \'N\' AND da.TAX_DEDUCTIONS = \'Y\'\
        join deposit_sub_acinfo dsa on da.deposit_no = dsa.deposit_no\
        where c.cust_id =:customerId AND dsa.acct_status =\'NEW\' AND dsa.authorize_status = \'AUTHORIZED\' AND (c.pan_number =:panNumber OR c.tan_no = :panNumber)';
       
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