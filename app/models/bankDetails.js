'use strict'
module.exports = (sequelize, DataTypes) => {
const bankDetails= sequelize.define('bankdetails', {
   IFSC_CODE:DataTypes.STRING,
    BANK_CODE:DataTypes.STRING,
    BRANCH_NAME:DataTypes.STRING,
    CITY:DataTypes.STRING,
    STATE:DataTypes.STRING,
    LOOKUP_DESC:DataTypes.STRING
   
},
    {
      underscored: true,
      tableName:'IFSC_BANK_BRANCH',
    });
        bankDetails.schema("TNPFC");
        return bankDetails;
   };