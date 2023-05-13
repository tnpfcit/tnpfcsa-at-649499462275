const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode,NoRecords} = require('../config/env');


exports.existingBankDetails = (req,res) =>{
    var customerId = req.body.customerId;
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);

    if(!customerId){

        return res.status(200).send({
            "responseCode":badRequestcode,
            "response":responseMessage
        });
    }
     
    var query = 'select TRIM(upper(ifsc_code)) "ifscCode", TRIM(upper(cust_name)) "accountHolderName", TRIM(upper(bank_name)) "bankName",\
    NVL (TRIM(upper(branch_name)), NULL) "branchName", \
    TRIM(account_no) "bankAccountNumber", GETBANKBRANCHADDRESS(TRIM(upper(ifsc_code))) "bankBranchAddress" from deposit_other_bank_details\
    where deposit_no in (select deposit_no from deposit_acinfo where cust_id =:customerId) \
    group by TRIM(upper(cust_name)),TRIM(upper(bank_name)),NVL(TRIM(UPPER(branch_name)),NULL),TRIM(upper(ifsc_code)),TRIM(account_no)';

    db.sequelize.query(query,{replacements:{customerId:customerId},type: sequelize.QueryTypes.SELECT}
    ).then(results=>{            
            if(results.length > 0){
                return res.status(200).send({
                    "responseCode":sucessCode,
                    "response":results
                });
            } else {
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
}