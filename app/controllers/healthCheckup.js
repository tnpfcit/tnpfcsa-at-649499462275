const db = require('../config/db.js');
const sequelize = require('sequelize');
exports.check = (req, res) => {
 db.sequelize.query('select 1 from dual').then(results => {
 
    return res.status(200).send({"message": "ok","responseCode":"200"});
 
 }).catch(err => {
    res.status(500).send({
        message: err.message
    });
  });
 };
  
 
  
  