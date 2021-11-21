const db = require('../config/db.js');
const sequelize = require('sequelize');

exports.findAll = (req, res) => {
var customerId = req.body.customerId;
if(customerId){
db.sequelize.query('select accountNumber AS "accountNumber", productDesc AS "productDesc",productId AS "productId",openDate AS "openDate",maturityDate AS "maturityDate",interestAmount AS "interestAmount",annualInterest as "annualInterest", interestRatePercent AS "interestRatePercent",depositAmount AS "depositAmount",maturityAmount "maturityAmount", productAliasName AS "productAliasName",accountStatus AS "accountStatus", eFdrUrl AS "eFdrUrl", depositAccountType AS "depositAccountType" from API_TD_SUMMARY WHERE customerId =:customerId',
    { replacements: { customerId: customerId }, type: sequelize.QueryTypes.SELECT }
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