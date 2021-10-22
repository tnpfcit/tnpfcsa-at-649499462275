'use strict'
const db = require('../config/db.js');
module.exports = (sequelize, DataTypes) => {
const depositCreation= sequelize.define('depositcreation', {

    // TITLE:DataTypes.STRING,
    // FNAME:DataTypes.STRING,
    // DOB:DataTypes.DATE,
    // PAN_NUMBER:DataTypes.STRING,
    // EMAIL_ID:DataTypes.STRING,
    // RELATIVE_NAME:DataTypes.STRING,
    // GENDER:DataTypes.STRING,
    // UNIQUE_ID:DataTypes.STRING,
    // RATION_CARD_NO:DataTypes.STRING,
    // PHONE_NUMBER:DataTypes.STRING,
    // GUARDIAN_NAME:DataTypes.STRING,
    // PH_NO:DataTypes.STRING,
    // RELATIONSHIP:DataTypes.STRING,
    // STREET:DataTypes.STRING
},
    {
       underscored: true,
      //tableName:'CUSTOMER',
     
    });
       // depositCreation.schema("TNPFC");
        return depositCreation;
   };