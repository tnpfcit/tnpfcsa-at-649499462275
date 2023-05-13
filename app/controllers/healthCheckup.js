const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {sucessCode} = require('../config/env');

exports.check = (req,res,err) => {
   db.sequelize.query('select 1 from dual').then(results => {
      return res.status(200).send({
         "message":"ok",
         "responseCode":sucessCode
      });
   }).catch(err => {
      return res.status(500).send({
         data:null,
         message: err.message
      });
   });
}