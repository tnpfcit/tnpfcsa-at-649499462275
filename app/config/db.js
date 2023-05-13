'use strict'
var moment = require('moment');
const Sequelize = require('sequelize-oracle');
const sequelize = new Sequelize('dbname','dbusername','dbpassword', { 
  /* replace dbname,dbusername and password, dbserverip with real values*/
  host:'dbserverip',
  database:'dbname',
  username:'dbusername',
  password:'dbpassword',
  port:'1521',
  dialect: 'oracle',
  logging: false,
  define:{
    underscored: true,
    freezeTableName: true,
    timestamps: false 
  },
  dialectOptions: {
    useUTC: false, // for reading from database
    dateStrings: true,
  typeCast: function (field, next) { // for reading from database
      if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
        return new Date(field.string);
      }
      return next();
    },	 
  },
  timezone:'Asia/Calcutta',
  insecureAuth: true
});
  
  
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

/* Models || Table Relationship */
db.customer = require('../models/customerTable.js')(sequelize, Sequelize);
db.customernominee =  require('../models/customerNominee.js')(sequelize, Sequelize);

db.getagelist = require('../models/getageList.js')(sequelize, Sequelize);
db.otplogin = require('../models/otpLogin.js')(sequelize, Sequelize);
db.custphone = require('../models/custPhone.js')(sequelize, Sequelize);
db.otpgeneration = require('../models/otpgeneration.js')(sequelize, Sequelize);
db.depositbankcreation = require('../models/depositbankCreation.js')(sequelize, Sequelize);
db.dmsImageUpload = require('../models/dmsImageUpload.js')(sequelize,Sequelize);
db.paymentgateway = require('../models/paymentGateway.js')(sequelize, Sequelize);
db.response = require('../models/paymentResponseTable.js')(sequelize, Sequelize);
db.logged = require('../models/logout.js')(sequelize, Sequelize);
db.customerProfile = require('../models/customerProfile.js')(sequelize, Sequelize);


module.exports = db;