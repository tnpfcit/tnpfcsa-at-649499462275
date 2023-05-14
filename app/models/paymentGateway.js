'use strict'
const db = require('../config/db.js');

module.exports = (sequelize, DataTypes) => {
const Payment= sequelize.define('Payment', {
   
    TRANSACTION_ID: DataTypes.INTEGER,
    AMOUNT:DataTypes.DECIMAL(10,2),
    UTR_NUMBER:DataTypes.STRING,
    PROD_ID:DataTypes.STRING,
    CHANNEL:DataTypes.STRING,
   
},
    {
      underscored: true,
      tableName:'RTGS_NEFT_ACKNOWLEDGEMENT'
    });
        Payment.removeAttribute("id");
        return Payment;
   };

  