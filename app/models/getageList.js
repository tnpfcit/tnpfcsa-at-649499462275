'use strict'
module.exports = (sequelize, DataTypes) => {
const getageList= sequelize.define('getagelist', {
    MINOR_AGE:DataTypes.INTEGER,
    RETIREMENT_AGE:DataTypes.INTEGER,
    SUPER_SR_CITIZEN_AGE:DataTypes.INTEGER
  },
    {
      underscored: true,
      tableName:'PARAMETERS',
    });
        //getageList.schema("TNPFC");
        return getageList;
   };

  