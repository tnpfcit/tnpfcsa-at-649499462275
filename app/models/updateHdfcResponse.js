'use strict'
const db = require('../config/db.js');

module.exports = (sequelize, DataTypes) => {
const Response= sequelize.define('response', {
   
    PG_REF_ID:DataTypes.STRING,
    BANK_REF_ID:DataTypes.STRING,
    TXN_DATE_TIME:DataTypes.DATE,
    STATUS:DataTypes.STRING,
    RESPONSE_CODE:DataTypes.STRING,
    RESPONSE_MESSAGE:DataTypes.STRING,
    ACCT_NUM:DataTypes.STRING
   
},
    {
      underscored: true,
      tableName:'RTGS_NEFT_ACKNOWLEDGEMENT'
      //timestamps: true,
    });
        //otpGeneration.schema("TNPFC");
        Response.removeAttribute("id");
       // otpGeneration.removeAttribute("updated_at");
       // otpGeneration.removeAttribute("created_at");
        return Response;
   };

  