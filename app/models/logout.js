'use strict'
module.exports = (sequelize, DataTypes) => {
const logOut = sequelize.define('logout', {
      
      USER_ID: DataTypes.STRING,
      LOG_IN: DataTypes.STRING,
      LOG_OUT: DataTypes.STRING
  },
    {
      underscored: true,
      tableName:'OAUTH_TOKENS'
    });
      return logOut;
   };