'use strict'
module.exports = (sequelize, DataTypes) => {
const Login= sequelize.define('login', {
    CUST_ID: DataTypes.STRING,
    PAN_NUMBER: DataTypes.STRING,
	UNIQUE_ID: DataTypes.STRING
    
},
    {
      underscored: true,
      tableName:'CUSTOMER',
     
    });
        //Login.schema("TNPFC_API");
        Login.removeAttribute("id");
        return Login;
   };