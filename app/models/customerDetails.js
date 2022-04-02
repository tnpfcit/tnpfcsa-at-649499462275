'use strict'
module.exports = (sequelize, DataTypes) => {
const customerDetails= sequelize.define('customerdetails', {
  
  customerName:DataTypes.STRING,
  customerId:DataTypes.STRING,
  dob:DataTypes.STRING,
  gender:DataTypes.STRING,
  maritalStatus:DataTypes.STRING,
  mobileNumber:DataTypes.STRING,
  phoneNumber:DataTypes.STRING,
  emailId:DataTypes.STRING,
  address:DataTypes.STRING,
  resident:DataTypes.BOOLEAN,
  customerType:DataTypes.STRING,
  occupation:DataTypes.STRING,
  customerCategory:DataTypes.STRING,
  salutation:DataTypes.STRING,
  isMinor:DataTypes.BOOLEAN,
  taxableIncome:DataTypes.STRING
},
    {
      underscored: true,
     // tableName:'CUSTOMER'
    });
        customerDetails.schema("TNPFC");
        return customerDetails;
   };
