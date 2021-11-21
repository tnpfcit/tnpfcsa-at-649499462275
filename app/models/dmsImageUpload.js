'use strict'
const db = require('../config/db.js');
//const db1 = require('../config/db1.js');
module.exports = (sequelize, DataTypes) => {
const dmsImageUpload= sequelize.define('dmsImageUpload', {
   
    //CUST_ID: DataTypes.STRING,
	//PROFILE_PIC: DataTypes.STRING,
	//ADDRESS_PROOF: DataTypes.STRING

	CUST_ID: DataTypes.STRING,
	DOC_TYPE: DataTypes.STRING,
	FILE_NAME: DataTypes.STRING

},
    {
      underscored: true,
		tableName:'CUSTOMER_DOC_DETAILS', 
      //tableName:'CUSTOMER',
      //timestamps: true,
    });
        //otpGeneration.schema("TNPFC");
        dmsImageUpload.removeAttribute("id");
       // otpGeneration.removeAttribute("updated_at");
       // otpGeneration.removeAttribute("created_at");
        return dmsImageUpload;
   };