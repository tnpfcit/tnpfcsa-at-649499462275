'use strict'
module.exports = (sequelize, DataTypes) => {
const customerTable= sequelize.define('customertable', {
      CUST_ID:DataTypes.STRING,
      PAN_NUMBER:DataTypes.STRING
  },
    {
      underscored: true,
      tableName:'CUSTOMER'
    });
        //customerTable.schema("TNPFC");
        customerTable.removeAttribute("id");
        return customerTable;
   };