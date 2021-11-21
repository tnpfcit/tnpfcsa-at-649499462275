'use strict'
const db = require('../config/db.js');
var moment = require('moment');
module.exports = (sequelize, DataTypes) => {
const otpGeneration= sequelize.define('otpgeneration', {
   
    CUST_ID: DataTypes.STRING,
    PHONE_NUMBER: DataTypes.STRING,
    OTP:DataTypes.DECIMAL(16,2),
    CREATED_DATE:{
    type: DataTypes.DATE,
    allowNull: false,
   //defaultValue: DataTypes.literal('CREATED_DATE.CURRENT_TIMESTAMP'),
    
    },
    STATUS:DataTypes.STRING,
    PAN_NUMBER:DataTypes.STRING
   
},
    {
      underscored: true,
      tableName:'API_OTPGENERATION',
      //timestamps: true,
    });
        //otpGeneration.schema("TNPFC");
        otpGeneration.removeAttribute("id");
       // otpGeneration.removeAttribute("updated_at");
       // otpGeneration.removeAttribute("created_at");
        return otpGeneration;
   };