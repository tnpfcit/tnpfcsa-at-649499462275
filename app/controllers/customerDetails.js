const db = require('../config/db.js');
const sequelize = require('sequelize');
const logger = require('../config/logger.js');


exports.findAll = (req, res) => {
var customerId = req.body.customerId;
if(customerId){
db.sequelize.query('select customerName AS "customerName", customerId AS "customerId",dob AS "dob",gender AS "gender",maritalStatus AS "maritalStatus",mobileNumber AS "mobileNumber", phoneNumber AS "phoneNumber",emailId AS "emailId", panNumber AS "panNumber", aadhaarNumber AS "aadhaarNumber", street AS "street",area AS "area",city AS "city", state AS "state",pincode AS "pincode", resident AS "resident",customerType AS "customerType",occupation AS "occupation",customerCategory AS "customerCategory", salutation AS "salutation", isMinor AS "isMinor",taxableIncome AS "taxableIncome",profilePic as "profilePic", addressproof as "addressProof", signature as "signature", district as "district", country as "country" from api_customerdetails  WHERE customerId =:customerId',
{ replacements: {customerId: customerId }, type: sequelize.QueryTypes.SELECT }
).then(results =>{
	//console.log(results);
	var ss = JSON.stringify(results);
	console.log(ss);
  if(results.length>0)
  {
  return res.status(200).send({"message": "ok","responseCode":"200","response":results});
  }
  else{
    res.send({"responseCode":"404","message": "customer details not found "});
  }
}).catch(err => {res.status(500).send({message: err.message});});
}
else{
  res.send({"responseCode":"401","message": "Invalid input parameters. Please check the key value pair in the request body."});
}
};