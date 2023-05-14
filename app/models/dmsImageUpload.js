'use strict'
const db = require('../config/db.js');
module.exports = (sequelize, DataTypes) => {
const dmsImageUpload= sequelize.define('dmsImageUpload', {
	CUST_ID: DataTypes.STRING,
	DOC_TYPE: DataTypes.STRING,
	FILE_NAME: DataTypes.STRING

},
    {
      underscored: true,
		  tableName:'CUSTOMER_DOC_DETAILS', 
    });
        dmsImageUpload.removeAttribute("id");
        return dmsImageUpload;
   };