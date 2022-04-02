const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,NoRecords,badRequestcode} = require('../config/env');

exports.form16A = (req, res) => {
  var {panNumber,quarter,financialYear} = req.body;
  quarter = quarter.toUpperCase();
  
  logger.info(`
    ${new Date()} || 
    ${req.originalUrl} || 
    ${JSON.stringify(req.body)} || 
    ${req.ip} || 
    ${req.protocol} || 
    ${req.method}
  `);
    
    if(panNumber && financialYear && quarter){
      
      var query = 'select file_name "fileName" from FORM16A_UPLOAD_DETAILS where pan =:panNumber and fin_year =:financialYear\
                    and quarter =:quarter';

      db.sequelize.query(query,{replacements:{panNumber:panNumber,financialYear:financialYear,quarter:quarter},type: sequelize.QueryTypes.SELECT}
      ).then(results =>{
        if(results.length > 0){
          return res.status(200).send({
            "responseCode":sucessCode,
            "response":[{"url":results[0].fileName,"panNumber":panNumber}]
          });
        } else {
          return res.status(200).send({
            "responseCode":resourceNotFoundcode,
            "response":[]
          });
        }
      }).catch(err => {
        return res.status(500).send({
          data:null,
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