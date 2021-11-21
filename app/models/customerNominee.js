'use strict'
module.exports = (sequelize, DataTypes) => {
const nominee= sequelize.define('nominee', {
        
    DEPOSIT_NO:DataTypes.STRING,
	CUST_ID:DataTypes.STRING
    
    },
    {
      underscored: true,
	  tableName:'DEPOSIT_NOMINEE_DETAIL'
    });
        //Nominee.schema("TNPFC");
		nominee.removeAttribute("id");
        return nominee;
   };