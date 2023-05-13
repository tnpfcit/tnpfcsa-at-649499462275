const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
//var powerbiMenu = require('./powerbi.json');
var {sucessCode} = require('../config/env');

exports.powerbiMenu = (req,res) =>{
    
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);
    
	var query = 'select mainhead "mainHead",subhead "subHead",url "url" from powerbi_menus';		
	db.sequelize.query(query).then(results =>{
		console.log ("query result===="+JSON.stringify(results));
		if(results.length == 0){
		  return res.status(200).send({
			 "responseCode":sucessCode,
			 "response":"No reports to show"
		  });
		}else {
		   return res.status(200).send({
			 "responseCode":sucessCode,
			 "response":results[0]
		  });
		}
	}).catch(err => {
		return res.status(500).send({
			data:null,
			message: err.message
		});
	});
    /*return res.status(200).send({
        "responseCode":sucessCode,
        "response":powerbiMenu
    });*/
}