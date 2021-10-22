const db = require('../config/db.js');
const sequelize = require('sequelize');
const { check, validationResult } = require('express-validator');

exports.creation = (req, res) => {

const response = validationResult(req);
  if (!response.isEmpty()) {
    return res.status(422).json({ "responseCode":"422",response: response.array() });
  }

var { productId, customerId, categoryId, period, frequency, depositAmt, roi, fdrRequired} = req.body;

if( productId && customerId && categoryId && period && frequency && depositAmt && roi && fdrRequired )
            
        {
           db.sequelize.query('select DEPOSIT_OPENING_API (:productId, :customerId, :categoryId, :period, :frequency, :depositAmt, :roi, :fdrRequired ) AS "depositNumber" from dual',
          { replacements: {productId: productId, customerId: customerId, categoryId: categoryId, period: period, frequency: frequency, depositAmt: depositAmt, roi: roi, fdrRequired: fdrRequired }, type: sequelize.QueryTypes.SELECT }).then(results =>{
           return res.status(200).send({"responseCode":"200","response":results[0]}); 
          }).catch(err => {res.status(500).send({ message: err.message});
          });
        }
  else
        {
         return res.status(422).send({"responseCode":"422","message": "Invalid input parameters. Please check the key value pair in the request body."});
        }
};
