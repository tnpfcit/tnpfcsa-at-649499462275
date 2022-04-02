'use strict'
const db = require('../config/db.js');

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
       
         TRANSACTION_ID: DataTypes.INTEGER,
         PROD_ID:DataTypes.INTEGER,
         PERIOD:DataTypes.INTEGER,
         INTEREST_PAY_FREQUENCY:DataTypes.INTEGER,      
         CUST_CATEGORY:DataTypes.STRING,               
         INT_RATE:DataTypes.DECIMAL(10,2),                   
         MATURITY_AMOUNT:DataTypes.DECIMAL(10,2),           
         STATUS: DataTypes.STRING,
         CUST_ID:DataTypes.STRING    		 
        
       
    },
        {
          underscored: true,
          tableName:'NETBANKING_TRANSACTION_DETAILS'
          //timestamps: true,
        });
            //otpGeneration.schema("TNPFC");
            Transaction.removeAttribute("id");
           // otpGeneration.removeAttribute("updated_at");
           // otpGeneration.removeAttribute("created_at");
            return Transaction;
       };