'use strict'
const db = require('../config/db.js');

module.exports = (sequelize, DataTypes) => {
const Response= sequelize.define('response', {
   
FMS_REF_ID:DataTypes.STRING,      
DEPOSIT_AMT:DataTypes.DECIMAL(10,2),
ACCT_NUM:DataTypes.INTEGER,
FE_PAY_TYPE:DataTypes.STRING,
REMARKS:DataTypes.STRING,         
STATUS: DataTypes.STRING,       
UTR_NUMBER: DataTypes.STRING,    
PAYMENT_METHOD: DataTypes.STRING,        
SENDER_ACT_NO:  DataTypes.STRING,       
SENDER_NAME:   DataTypes.STRING,
SENDER_BANK_NAME:DataTypes.STRING,
PAYMENT_ADVICE_URL:DataTypes.STRING,      
CREATED_DT:DataTypes.DATE,       
TRANSACTION_ID:{
  type: DataTypes.STRING,
  primaryKey: true,
},
CHANNEL:DataTypes.STRING, 
BANK_REF_ID:DataTypes.STRING,         
RESPONSE_CODE:DataTypes.STRING,         
RESPONSE_MESSAGE:DataTypes.STRING,        
PG_REF_ID:DataTypes.STRING,    
TXN_DATE_TIME:DataTypes.DATE,         
PRODUCT_ID:DataTypes.STRING, 
CATEGORY_ID:DataTypes.STRING, 
CUSTOMER_ID:DataTypes.STRING,   
MATURITY_AMOUNT:DataTypes.DECIMAL(10,2),   
PERIOD:DataTypes.DECIMAL(10,2),
INT_PAY_FREQUENCY:DataTypes.DECIMAL(10,2),
RATE_OF_INT:DataTypes.DECIMAL(10,2),       
RTGS_NEFT_AMT_RECEIVED:DataTypes.DECIMAL(10,2)
   
},
    {
      underscored: true,
      tableName:'PG_RTGS_NEFT_TRANS_DETAILS'
      //timestamps: true,
    });
        //otpGeneration.schema("TNPFC");
        Response.removeAttribute("id");
       // otpGeneration.removeAttribute("updated_at");
       // otpGeneration.removeAttribute("created_at");
        return Response;
   };

  