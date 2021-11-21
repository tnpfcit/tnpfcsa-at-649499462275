'use strict'
module.exports = (sequelize, DataTypes) => {
const customerProfile= sequelize.define('customerprofile', {
      CUST_ID:DataTypes.STRING,
      PRIMARY_OCCUPATION:DataTypes.STRING,
      GENDER:DataTypes.STRING,
      TITLE:DataTypes.STRING,
      MARITALSTATUS:DataTypes.STRING
    },
    {
      underscored: true,
      tableName:'CUSTOMER'
    });
    //customerTable.schema("TNPFC");
    customerProfile.removeAttribute("id");
    return customerProfile;
};