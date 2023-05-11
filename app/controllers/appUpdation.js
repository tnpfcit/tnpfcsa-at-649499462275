const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var appUpdation = require('../config/env.json');
var {sucessCode} = require('../config/env');


exports.appupdate = (req,res) =>{
    
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);
    
    return res.status(200).send({
        "responseCode":sucessCode,
        "response":appUpdation
    });
}