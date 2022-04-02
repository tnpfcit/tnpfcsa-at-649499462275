const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode,NoRecords} = require('../config/env');

exports.financialyear = (req, res, err) => {
    
    var customerId = 'C000787878';

    logger.info(`
      ${new Date()} || 
      ${req.originalUrl} || 
      ${JSON.stringify(req.body)} || 
      ${req.ip} || 
      ${req.protocol} || 
      ${req.method}
    `);

    //var result = [{fyCode:"20-21", fyYear:"2020-2021"},{fyCode:"21-22",fyYear:"2021-2022"}];

    //return res.status(200).send({"responseCode":sucessCode,"response":result});

    if(customerId) {
      
      var query = 'SELECT API_GETFINYEAR(-1) as "fin" FROM DUAL\ UNION\ SELECT API_GETFINYEAR(0) "fin" FROM DUAL'; 
      
      // query to fetch results from db
      db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT}
      ).then(results => {
        console.log("================results"+JSON.stringify(results));

        if(results.length > 0){
          //var result = [{fyCode:"20-21", fyYear:results[0].fin},{ fyCode:"21-22",fyYear:results[1].fin}];
          return res.status(200).send({
            "responseCode":sucessCode,
            "response":[{fyCode:"20-21", fyYear:results[0].fin},{ fyCode:"21-22",fyYear:results[1].fin}]
          });
        } else {
          return res.status(200).send({
            "responseCode":resourceNotFoundcode,
            "response":NoRecords
          }); 
        }
      }).catch(err => {
        res.status(500).send({
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