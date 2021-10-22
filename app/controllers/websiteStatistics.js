const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {sucessCode,NoRecords,resourceNotFoundcode} = require('../config/env');


exports.stastics = (req,res) =>{
    
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);

    var query = 'select count (*) as "depositCount" , ROUND(sum(deposit_amt)/10000000,0)||\' \'||\'Cr\' as "depositValue",API_PAYMENT_TRANSACTION_COUNT() as "transactionCount"  from\
    deposit_sub_acinfo where authorize_status != \'REJECTED\' AND STATUS != \'DELETED\'AND ACCT_STATUS IN (\'NEW\',\'MATURED\')';
    
    db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT}
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
}