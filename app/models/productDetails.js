'use strict'
module.exports = (sequelize, DataTypes) => {
const productDetails= sequelize.define('productdetails', {
  
  productId:DataTypes.STRING,
  productName:DataTypes.STRING,
  productAliasName:DataTypes.STRING,
  categoryId:DataTypes.STRING,
  tenure:DataTypes.DECIMAL(10,2),
  monthly_int_rate:DataTypes.DECIMAL(10,3),
  quarterly_int_rate:DataTypes.DECIMAL(10,3),
  yearly_int_rate:DataTypes.DECIMAL(10,3),
  remarks:DataTypes.STRING
},
    {
      underscored: true,
     // tableName:'CUSTOMER'
    });
        //productDetails.schema("TNPFC");
        return productDetails;
   };