'use strict'
module.exports = (sequelize, DataTypes) => {
const customerAddress= sequelize.define('customeraddress', {
    LOOKUP_ID:{
        type:DataTypes.STRING,
        primarykey: true
    },
    LOOKUP_REF_ID:DataTypes.STRING,
    LOOKUP_DESC:DataTypes.STRING
},
    {
      underscored: true,
      tableName:'LOOKUP_MASTER',
    });
        customerAddress.schema("TNPFC");
        return customerAddress;
   };