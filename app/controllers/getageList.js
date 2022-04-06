const db = require('../config/db.js');
const sequelize = require('sequelize');
const logger = require('../config/logger.js');
const {responseMessage,sucessCode,resourceNotFoundcode,NoRecords} = require('../config/env');


exports.agelist = (req,res,err) =>{
	logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);
	
	var query = 'select MINOR_AGE "minorAge", RETIREMENT_AGE "retirementAge",\
    SUPER_SR_CITIZEN_AGE "superSeniorCitizen" FROM PARAMETERS';
	
	db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT}
	).then(results=>{
     if(results.length > 0){
            return res.status(200).send({
                "responseCode":sucessCode,
                "response":results
            });
        } else {
            return res.status(404).send({
                "responseCode":resourceNotFoundcode,
                "response":NoRecords
            });
        }
    }).catch(err => {
        return res.status(500).send({
            data:null,
            message: err.message
        });
    });
}

   