const db = require('../config/db.js');
const Sequelize = require('sequelize');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode,NoRecords} = require('../config/env');


exports.loanDetails = (req, res, err) =>{ 
  
  var customerId = req.body.customerId;
  
  logger.info(`
    ${new Date()} || 
    ${req.originalUrl} || 
    ${JSON.stringify(req.body)} || 
    ${req.ip} || 
    ${req.protocol} || 
    ${req.method}
  `);
  
  if(customerId){
      
      var query = 'select depositAccountNumber "depositAccountNumber",loanAccountNumber "loanAccountNumber",depositAmount "depositAmount",\
      loanAvialedAmount "loanAvialedAmount",loanEligibleAmount "loanEligibleAmount",loanOpenDate "loanOpenDate",\
      loanClosureDueDate "loanClosureDueDate",loanInterestRate "loanInterestRate",loanInterestDue "loanInterestDue",\
      loanAccountStatus "loanAccountStatus",loaninterestCollected "loaninterestCollected",productDesc "productDesc"\
      from api_loans WHERE customerId =:customerId';

       // query to fetch results from db
      db.sequelize.query(query,{replacements:{customerId:customerId},type: sequelize.QueryTypes.SELECT }
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
        logger.error("error in fetching query results ===="+ err);
        return res.status(500).send({
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

