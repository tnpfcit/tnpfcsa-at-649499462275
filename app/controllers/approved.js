const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var moment = require('moment');
var {
    sucessCode,
    badRequestcode,
    resourceNotFoundcode,
    NoRecords,
    responseMessage
} = require('../config/env.js');

exports.approving = (req,res,err) =>{
    
    var {         
        accountNumber,
        userId,
        remarks,
        userStatus,
        batchId,
        transactionAmount,
        roleId,
        purpose,
        transDt
    } = req.body;
    
    transDt = moment(transDt).format('DD-MMM-YYYY');

    logger.info(`        
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
    
    if (accountNumber && userId && remarks && userStatus && batchId && transactionAmount && roleId && purpose && transDt){
        
        db.sequelize.query('select API_MANAGEMENT_APPROVAL(:accountNumber,:userId,:remarks,:userStatus,:batchId,\
            :transactionAmount,:roleId,:purpose,:transDt) as accountNumber from dual',
            {replacements: {
                accountNumber: accountNumber, 
                userId: userId, 
                remarks: remarks, 
                userStatus: userStatus, 
                batchId: batchId, 
                transactionAmount: transactionAmount,
                roleId: roleId,
                purpose: purpose, 
                transDt: transDt},
            type: sequelize.QueryTypes.SELECT}
        ).then(results => {
            logger.info("approved results"+JSON.stringify(results));
            return res.status(200).send({
                "responseCode":sucessCode,
                "response":"updated sucessfully"
            }); 
        }).catch(err => {
            logger.error(err);
            res.status(500).send({
                data:null,
                message: err.message
            });
        });
    } else {
        return res.status(400).send({
            "responseCode":badRequestcode,
            "response":responseMessage
        });
    }
}

