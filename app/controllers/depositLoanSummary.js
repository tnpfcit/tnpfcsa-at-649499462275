const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {responseMessage,sucessCode,badRequestcode,resourceNotFoundcode,NoRecords} = require('../config/env');


exports.singleLoanDetails = (req, res) =>{ 
    
    var accountNumber = req.body.accountNumber;
    
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
        
        if(accountNumber){
            
            /*var query = 'select depositAccountNumber "depositAccountNumber", loanAccountNumber "loanAccountNumber",\
            depositAmount "depositAmount",loanAvialedAmount "loanAvialedAmount",loanEligibleAmount "loanEligibleAmount",\
            loanOpenDate  "loanOpenDate", loanClosureDueDate "loanClosureDueDate",loanInterestRate "loanInterestRate",\
            loanInterestDue "loanInterestDue", loanAccountStatus "loanAccountStatus",loaninterestCollected "loaninterestCollected",\
            productDesc "productDesc" from api_loans WHERE depositAccountNumber =:accountNumber';*/
			
			var query = 'SELECT * FROM (select depositAccountNumber "depositAccountNumber", loanAccountNumber "loanAccountNumber",\
            depositAmount "depositAmount",loanAvialedAmount "loanAvialedAmount",loanEligibleAmount "loanEligibleAmount",\
            loanOpenDate  "loanOpenDate", loanClosureDueDate "loanClosureDueDate",loanInterestRate "loanInterestRate",\
            loanInterestDue "loanInterestDue", loanAccountStatus "loanAccountStatus",loaninterestCollected "loaninterestCollected",\
            productDesc "productDesc" from api_loans WHERE  DEPOSITACCOUNTNUMBER =:accountNumber\
            UNION\
            SELECT DEPOSIT_NO AS "depositAccountNumber", NULL AS "loanAccountNumber", deposit_amt AS "depositAmount", 0 AS "loanAvialedAmount",\
            ROUND((DEPOSIT_AMT * .70),0) AS "loanEligibleAmount", NULL AS "loanOpenDate", NULL AS "loanClosureDueDate", (RATE_OF_INT +2) AS "loanInterestRate",\
            0 AS "loanInterestDue", NULL AS "loanAccountStatus", 0 AS "loaninterestCollected", null as "productDesc"\
            FROM DEPOSIT_SUB_ACINFO WHERE DEPOSIT_NO =:accountNumber) a where rownum=1';
            
            db.sequelize.query(query,{replacements: {accountNumber: accountNumber}, type: sequelize.QueryTypes.SELECT }
            ).then(results =>{
                if(results.length>0){
                    return res.status(200).send({
                        "responseCode":sucessCode,
                        "response":results
                    });
                } else {
                    return res.status(404).send({
                        "responseCode":resourceNotFoundcode,
                        "response":NoRecords
                    });
                }
		    }).catch(err => {
                logger.error(err);
                    return res.status(500).send({
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

