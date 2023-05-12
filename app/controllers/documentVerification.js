const db = require('../config/db.js');
const sequelize = require('sequelize');
var http = require('http');
var request = require('request');
var moment = require('moment');
var logger = require('../config/logger');
var {responseMessage,badRequestcode,NoRecords,activeDetailsMissedPan,activeDetailsPan,
    resourceNotFoundcode,message,validPan,invalidPan,technicalError,
    validAadhaar,invalidAadhaar,videoIdentification,aadhaarurl,panUrl} = require('../config/env');

exports.documentVerification = (req,res) =>{
 var {
        number,
        type,
        name,
        dob,
        isDbVerifyReq 
    } = req.body;
	
	isDbVerifyReq =  isDbVerifyReq ?  isDbVerifyReq : 'Y';
	
	 logger.info(`
        ${new Date()} || 
        ${req.originalUrl} ||                                        
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
	
    if(number && type == "aadhar"){
		if(isDbVerifyReq !== 'N'){
			var query = 'select UNIQUE_ID as "aadhaarNumber" from customer where UNIQUE_ID =:number';
            db.sequelize.query(query,{replacements: {number: number}, type: sequelize.QueryTypes.SELECT}
			).then(results=>{
				console.log(results);    
				if (results.length > 0){
					return res.status(200).send({
                     "responseCode":3,
                     "response":message,
                     "number":results[0].UNIQUE_ID
					});
				} else {
			  /*request.get(aadhaarurl+number+"&proofRequired=true", (error, response, body) => {        //here starts 
                     console.log("hello");
					 console.log("response============="+JSON.stringify(response));
					 console.log("statuscode============"+response.statusCode);
                    if(response.body && response.statusCode !== 500){
                        var parsedAadhaar = JSON.parse(response.body);
						console.log("PARSEDAADHAAR==========="+JSON.stringify(parsedAadhaar));
                        if (parsedAadhaar.code == 0){
                            return res.status(200).send({
                                "responseCode":0,
                                "response":invalidAadhaar
                            });
                        } else if(parsedAadhaar.code == 1){
                            return res.status(200).send({
                                "responseCode":1,
                                "response":validAadhaar
                            });   
                        } else if(parsedAadhaar.code == -1){
                            return res.status(200).send({
                                "responseCode":-1,
                                "response":"Technical Error. Try again."
                            });
                        } else {
							return res.status(200).send({
                                "responseCode":-1,
                                "response":"Technical Error. Try again."
                            });
							
						}
                    } else {
                        return res.status(404).send({
                            "responseCode":resourceNotFoundcode,
                            "response":"Resource Not Found"
                        });
                    }                 
                })*/
					 return res.status(200).send({"responseCode":1,"response":validAadhaar});  //enable this 
                }

            }).catch(err => { 
			logger.error("aadhar number searching query fails ==="+ err);
			res.status(500).send({ 
				data:null,
				message: err.message
			});
		});
        } else {
			console.log('db not verify');
			/*request.get(aadhaarurl+number+"&proofRequired=true", (error, response, body) => {
			   console.log("inside dbnot verify===="+response);
                console.log(response.body);
                if(response.body && response.statusCode !== 500){
                    var parsedAadhaar = JSON.parse(response.body);
                    if (parsedAadhaar.code == 0){
                        return res.status(200).send({
                            "responseCode":0,
                            "response":invalidAadhaar
                        });
                    } else if(parsedAadhaar.code == 1){
                        return res.status(200).send({
                            "responseCode":1,
                            "response":validAadhaar
                        });   
                    } else {
                        return res.status(200).send({
                            "responseCode":-1,
                            "response":technicalError
                        });
                    }
                } else {
                    return res.status(404).send({
                        "responseCode":resourceNotFoundcode,
                        "response":"Resource Not Found"
                    });
                }                 
            });*/
			return res.status(200).send({"responseCode":1,"response":validAadhaar});

        }
    
    } else if (number && type == "pan" && name && dob){
		var responseDate = moment(dob).format('DD/MM/YYYY');
		console.log(responseDate);
        
        var query = 'select PAN_NUMBER as "panNumber" from customer where PAN_NUMBER =:number'
        
        db.sequelize.query(query,{replacements: {number: number}, type: sequelize.QueryTypes.SELECT}
        ).then(results=>{
                if(results.length > 0){
                    return res.status(200).send({
                        "responseCode":3,
                        "response":message,
                        "number":results[0].PAN_NUMBER
                    });
                } else {
                    /*request.get(panUrl+number+'&name='+name+'&dob='+responseDate, (error, response, body) => {
                        if(response.body && response.statusCode !== 500){
                            var parsedPan = JSON.parse(response.body);
                            
                            if (parsedPan && parsedPan.responseCode == 0){
                                return res.status(200).send({
                                    "responseCode":0,
                                    "response":invalidPan
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
                    })*/
					return res.status(200).send({
                                    "responseCode":2,
                                    "response":videoIdentification
                                });
                }
            }).catch(err => {
				logger.error("pan selecting query fails ====="+ err);
				res.status(500).send({
                data:null,
                message: err.message
				});
			});
        }else {
             return res.status(400).send({
            "responseCode":badRequestcode,
            "response":responseMessage
			});
        }
}