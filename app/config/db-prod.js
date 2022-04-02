'use strict'

const Sequelize = require('sequelize-oracle');
//Sequelize.maxRows = 10;
const sequelize = new Sequelize('CBMS','TNPFC','TnPfCc3m5', {
 database:'CBMS',
 username:'TNPFC',
 password:'TnPfCc3m5',
 host:'3.6.140.141',
 port:'1521',
dialect: 'oracle',
logging: false,
define: {
  underscored: true,
  freezeTableName: true,
  timestamps: false 
 },
 dialectOptions: {
  useUTC: false, // for reading from database
  dateStrings: true,
  typeCast: function (field, next) {
    if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
        return new Date(field.string());
    }
    return next();
},
 },
  
 
  timezone :'+05:30',
  insecureAuth: true
});
  
//console.log("sdnddjfdfjjfjfjrfjrjgrjgjrkgjkrjgkrjklgjrkgjrkjglrkjgkjrgk");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// tables
db.customer = require('../models/customerTable.js')(sequelize, Sequelize);
//db.fdsummary = require('../models/fdSummary.js')(sequelize, Sequelize);
db.customernominee =  require('../models/customerNominee.js')(sequelize, Sequelize);
//db.fddetails = require('../models/fdDetails.js')(sequelize, Sequelize);
db.customerdetails = require('../models/customerDetails.js')(sequelize, Sequelize);
//db.loans = require('../models/fdLoans.js')(sequelize, Sequelize);
db.productdetails = require('../models/productDetails.js')(sequelize, Sequelize);
db.customercreation = require('../models/customerCreation.js')(sequelize, Sequelize);
db.customeraddress = require('../models/customerAddress.js')(sequelize, Sequelize);
db.getagelist = require('../models/getageList.js')(sequelize, Sequelize);
db.depositcreation = require('../models/depositCreation.js')(sequelize, Sequelize);
db.otplogin = require('../models/otpLogin.js')(sequelize, Sequelize);
db.custphone = require('../models/custPhone.js')(sequelize, Sequelize);
db.otpgeneration = require('../models/otpgeneration.js')(sequelize, Sequelize);
db.bank = require('../models/bankDetails.js')(sequelize, Sequelize);
db.depositbankcreation = require('../models/depositbankCreation.js')(sequelize, Sequelize);
db.dmsImageUpload = require('../models/dmsImageUpload.js')(sequelize,Sequelize);
db.paymentgateway = require('../models/paymentGateway.js')(sequelize, Sequelize);
db.transDetails = require('../models/netbankTransDetails.js')(sequelize, Sequelize);
//db.transDetails = require('../models/netbankTransDetails.js')(sequelize, Sequelize);
db.hdfcUpdate = require('../models/updateHdfcResponse.js')(sequelize, Sequelize);
db.response = require('../models/paymentResponseTable.js')(sequelize, Sequelize);
db.paymentResponse = require('../models/inrPaymentService.js')(sequelize, Sequelize);
db.approve = require('../models/approved.js')(sequelize, Sequelize);


module.exports = db;