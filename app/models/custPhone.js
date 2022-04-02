module.exports = (sequelize, DataTypes) => {
    const custPhone= sequelize.define('custphone', {
        CUST_ID:{
            type:DataTypes.STRING,
            primarykey: true
        },
        PHONE_NUMBER:DataTypes.STRING,
        
    },
        {
          underscored: true,
          tableName:'CUST_PHONE',
        });
            //custPhone.schema("TNPFC");
            custPhone.removeAttribute("id");
            return custPhone;
       };