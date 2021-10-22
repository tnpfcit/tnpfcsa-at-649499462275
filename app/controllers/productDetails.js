const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {
   sucessCode,
   resourceNotFoundcode,
   badRequestcode
} = require('../config/env');

exports.productDetails = (req, res, err) => {
   
   logger.info(`
      ${res.StatusCode} || 
      ${new Date()} || 
      ${req.originalUrl} || 
      ${JSON.stringify(req.body)} || 
      ${req.ip} || 
      ${req.protocol} || 
      ${req.method}
   `);
   
   var query = 'select productId "productId", productName "productName", productAliasName "productAliasName",categoryId "categoryId",\
   tenure "tenure",monthlyIntRate "monthlyIntRate",quarterlyIntRate "quarterlyIntRate",yearlyIntRate "yearlyIntRate",\
   onMaturityRate "onMaturityRate ",remarks "remarks",minDepositAmt "minDepositAmt",amtMultiply "amtMultiply" from api_productdetails';
	
   db.sequelize.query(query).then(results =>{
	  var result = results[0];
	  var yearlyIntRate = Math.round(result[4].yearlyIntRate*100)/100;
	   result[4].yearlyIntRate = yearlyIntRate;
	   results[0] = result;
      return res.status(200).send({
         "responseCode":sucessCode,
         "response":results[0]
      });
   }).catch(err => {
      return res.status(500).send({
         data:null,
         message: err.message
      });
   });
}