const db = require('../config/db.js');
const sequelize = require('sequelize');
const logger = require('../config/logger');
var custProfile = db.customerProfile;
var {
    responseMessage,
    sucessCode,
    resourceNotFoundcode,
    badRequestcode,
    NoRecords} = require('../config/env');

exports.customerProfileInfo = (req,res,err) => {
    
    var {type,value,customerId} = req.body;
    
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);


    if(type == 'GENDER' && value && customerId){
        custProfile.update({GENDER: value},{ where: { CUST_ID: customerId}}).then(results =>{
            if(results.length > 0){
                return res.status(200).send({
                    "responseCode":sucessCode,
                    "response":"Gender Information Updated Sucessfully"
                });
            } else {
                return res.status(200).send({
                    "responseCode":badRequestcode,
                    "response":"Not updated try again"
                });
            }
        }).catch(err=>{
            logger.error("profile inforamtion error"+err);
            return res.status(500).send({
                data:null,
                response: err.message
            });
        }); 
    } else if (type == 'TITLE' && value && customerId){
        custProfile.update({TITLE: value},{ where: { CUST_ID: customerId}}).then(results =>{
            if(results.length > 0){
                return res.status(200).send({
                    "responseCode":sucessCode,
                    "response":"Title Information Updated Sucessfully"
                });
            } else {
                return res.status(200).send({
                    "responseCode":badRequestcode,
                    "response":"Not updated try again"
                });
            }
        }).catch(err=>{
            logger.error("profile inforamtion error"+err);
            return res.status(500).send({
                data:null,
                response: err.message
            });
        }); 
    } else if(type == 'OCCUPATION' && value && customerId){
        custProfile.update({PRIMARY_OCCUPATION: value},{ where: { CUST_ID: customerId}}).then(results =>{
            if(results.length > 0){
                return res.status(200).send({
                    "responseCode":sucessCode,
                    "response":"Occupation Information Updated Sucessfully"
                });
            } else {
                return res.status(200).send({
                    "responseCode":badRequestcode,
                    "response":"Not updated try again"
                });
            }
        }).catch(err=>{
            logger.error("profile inforamtion error"+err);
            return res.status(500).send({
                data:null,
                response: err.message
            });
        }); 

    } else if (type == 'MARITALSTATUS' && value && customerId){
        custProfile.update({MARITALSTATUS: value},{ where: { CUST_ID: customerId}}).then(results =>{
            if(results.length > 0){
                return res.status(200).send({
                    "responseCode":sucessCode,
                    "response":"MartialStatus Information Updated Sucessfully"
                });
            } else {
                return res.status(200).send({
                    "responseCode":badRequestcode,
                    "response":"Not updated try again"
                });
            }
        }).catch(err=>{
            logger.error("profile inforamtion error"+err);
            return res.status(500).send({
                data:null,
                response: err.message
            });
        });

    } else {
        return res.status(200).send({
            "responseCode":badRequestcode,
            "response":responseMessage
        });
    }
}