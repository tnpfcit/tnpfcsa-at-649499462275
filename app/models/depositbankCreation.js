'use strict';
const validator = require('validator');
module.exports = (sequelize, DataTypes) => {
const depositbankCreation= sequelize.define('depositbankcreation', {

     DEPOSIT_NO:{
         type:DataTypes.STRING,
         //allowNull:false,
        //  validate: {
        //     len: [13, 13],
        //     isInt:true
        //  }
     },
    ACCOUNT_NO:{
        type: DataTypes.STRING,
        // validate: {
        //     isInt:true
        //  }
    },
    BANK_CODE:DataTypes.DECIMAL(10),
    BANK_NAME:DataTypes.STRING,
    BRANCH_NAME:DataTypes.STRING,
    CUST_NAME:DataTypes.STRING,
    IFSC_CODE:DataTypes.STRING,
    MICR_CODE:DataTypes.STRING,
    NEFT_ECS:DataTypes.STRING,
    STATUS:DataTypes.STRING,
    STATUS_BY:DataTypes.STRING,
    STATUS_DT:DataTypes.DATE,
    // RELATIONSHIP:DataTypes.STRING,
    // STREET:DataTypes.STRING
},
    {
       underscored: true,
       tableName:'DEPOSIT_OTHER_BANK_DETAILS'
      
     
    });
        //depositCreation.schema("TNPFC");
        depositbankCreation.removeAttribute("id");
        return depositbankCreation;
   };