const db = require('../config/db.js');
const sequelize = require('sequelize');


exports.findAll = (req, res) => {
  console.log("dndjf");
 var customerId = req.body.customerId;
if(customerId){
db.sequelize.query('select customerId AS "customerId", guardianName AS "guardianName", depositNumber AS "depositNumber",nomineeName AS "nomineeName",relationship AS "relationship", nomineeIsMinor AS "nomineeIsMinor", nomineePhoneNumber AS "nomineePhoneNumber", guardianRelationship AS "guardianRelationship",guardianPhoneNumber AS "guardianPhoneNumber" from api_getCustomerNominees  WHERE customerId =:customerId',
{ replacements: {customerId: customerId }, type: sequelize.QueryTypes.SELECT }
  ).then(results => {
    if(results.length>0)
    {
        return res.status(200).send({"message": "ok","responseCode":"200","response":results});
    }
    else{
      res.send({"responseCode":"404","message": "customer details not found "});
    }
  }).catch(err => {
    res.status(500).send({
        message: err.message
    });
  });
}
  else{
    res.send({"responseCode":"401","message": "Invalid input parameters. Please check the key value pair in the request body."}); 
  }
  };
  
 
  
  