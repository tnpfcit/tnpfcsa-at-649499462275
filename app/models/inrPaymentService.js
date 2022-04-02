'use strict';
//const validator = require('validator');
module.exports = (sequelize, DataTypes) => {
const paymentService= sequelize.define('paymentService', {

    

    CUST_ID:DataTypes.STRING,
    PURPOSE:DataTypes.STRING,
    INT_PAY_FREQUENCY:DataTypes.INTEGER, 
    STATUS:DataTypes.STRING, 
    CREATE_DT:DataTypes.DATE,
    DEPOSIT_AMT:DataTypes.INTEGER,
    TYPE_OF_DEPOSIT:DataTypes.INTEGER,
    ACKNWLDGE_DT:DataTypes.DATE, 
    PERIOD_OF_DEPOSIT:DataTypes.INTEGER,
    ACKNWLDGE_ID:DataTypes.STRING,
	BRANCH_CODE:DataTypes.INTEGER,
	CREATED_BY:DataTypes.STRING,
	STATUS_BY:DataTypes.STRING,
	MULTIPLE_DEPOSIT:DataTypes.STRING,
	REQ_CHANNEL:DataTypes.STRING
    
},
    {
       underscored: true,
       tableName:'ACKNOWLEDGEMENT'
      
     
    });
        //depositCreation.schema("TNPFC");
        paymentService.removeAttribute("id");
        return paymentService;
   };