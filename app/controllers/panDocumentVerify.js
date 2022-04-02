const db = require('../config/db.js');
const sequelize = require('sequelize');
var http = require('http');
var request = require('request');
var moment = require('moment');
var logger = require('../config/logger');
var {responseMessage,badRequestcode,NoRecords,activeDetailsMissedPan,activeDetailsPan,
    resourceNotFoundcode,message,validPan,invalidPan,technicalError,
    validAadhaar,invalidAadhaar,videoIdentification,aadhaarurl,panUrl} = require('../config/env');

exports.panVerification = (req,res) =>{

    var {
        number,
        type,
        name,
        dob
    } = req.body;
        
    var responseDate = moment(dob).format('DD/MM/YYYY');
    console.log(responseDate);
        
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);

        if(number && type == "pan" && name && responseDate){
            
            request.get(panUrl+number+'&name='+name+'&dob='+responseDate, (error, response, body) => {
                if(response.body && response.statusCode !== 500){
                    var parsedPan = JSON.parse(response.body);
                    
                    if (parsedPan && parsedPan.responseCode == 0){
                        return res.status(200).send({
                            "responseCode":0,
                            "response":"Either Pan or DOB incorrect"
                        });
                    } else if (parsedPan && parsedPan.responseText == activeDetailsPan){
                        return res.status(200).send({
                            "responseCode":1,
                            "response":validPan
                        });   
                    } else if (parsedPan && parsedPan.responseText == activeDetailsMissedPan){
                        return res.status(200).send({
                            "responseCode":2,
                            "response":videoIdentification
                        });   
                    } else {
                        return res.status(200).send({
                            "responseCode":-1,
                            "response":technicalError
                        });
                    }
                } else {
                    return res.status(500).send({
                         data:null,
                        "response":technicalError
                    });
                } 
            })
        } else {
            return res.status(200).send({
                "responseCode":badRequestcode,
                "response":responseMessage
            });
        }
}    