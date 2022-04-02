const db = require('../config/db.js');
const sequelize = require('sequelize');
var appUpdation = require('../config/env.json');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode} = require('../config/env');


exports.appupdate = (req,res) =>{
    return res.status(200).send({"responseCode":sucessCode,"response":appUpdation});
}