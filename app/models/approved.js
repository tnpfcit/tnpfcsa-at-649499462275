'use strict'
module.exports = (sequelize, DataTypes) => {
const approveMaster= sequelize.define('approveMaster', {
        
    PURPOSE:DataTypes.STRING,
    ACT_NUM:DataTypes.STRING,
    BATCH_ID:DataTypes.STRING,
    TRANS_DT:DataTypes.DATE,
    AMOUNT:DataTypes.DECIMAL(24,2),
    STATUS:DataTypes.STRING,
    REMARKS:DataTypes.STRING,
    STATUS_BY:DataTypes.STRING,
    STATUS_DT:DataTypes.DATE,
    CMD_APPROVAL_REQ:DataTypes.STRING,
    GM_AUTH_STATUS:DataTypes.STRING,
    GM_USER_ID:DataTypes.STRING,
    GM_TIMESTAMP:DataTypes.DATE,
    GM_REMARKS:DataTypes.STRING,
    CMD_AUTH_STATUS:DataTypes.STRING,
    CMD_USER_ID:DataTypes.STRING,
    CMD_TIMESTAMP:DataTypes.DATE,
    CMD_REMARKS:DataTypes.STRING,
    
    },
    {
      underscored: true,
	  tableName:'APPROVAL_MASTER'
    });
        //Nominee.schema("TNPFC");
		approveMaster.removeAttribute("id");
        return approveMaster;
   };