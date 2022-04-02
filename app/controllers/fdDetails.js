const db = require('../config/db.js');
const sequelize = require('sequelize');

exports.findAll = (req, res) => {
var customerId = req.body.customerId;
if(customerId){
db.sequelize.query('select "accountNumber", "productDesc", "productId", "openDate", "maturityDate", "interestAmount", "annualInterest",  "interestRatePercent", "depositAmount", "maturityAmount", "productAliasName","accountStatus", "eFdrUrl", "depositAccountType" from table (get_cust_fd_details(:customerId)) where "customerId"=:customerId',
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