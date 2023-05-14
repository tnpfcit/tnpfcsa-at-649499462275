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
    allowNull: false
    },
    STATUS:DataTypes.STRING,
    PAN_NUMBER:DataTypes.STRING
   
},
    {
      underscored: true,
      tableName:'API_OTPGENERATION',

    });
        otpGeneration.removeAttribute("id");
        return otpGeneration;
   };