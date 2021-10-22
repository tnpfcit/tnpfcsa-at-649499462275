const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {sucessCode,badRequestcode} = require('../config/env.js');

exports.relationship = (req,res) => {
    
    var query = "select LOOKUP_REF_ID as \"relationshipCode\",LOOKUP_DESC as \"relationshipName\" from LOOKUP_MASTER \
	a left join PORTAL_RELATIONSHIP_VIEW_ORDER b on a.lookup_ref_id = B.RELATIONSHIP_CODE \
	where LOOKUP_ID = 'RELATIONSHIP' order by B.DISPLAY_SEQUENCE";
    
    db.sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}
    ).then(results=>{
        if(results.length>0){
            return res.status(200).send({
                "responseCode":"200",
                "response":results
            });
        } else {
            return res.status(200).send({
                "responseCode":"455",
                "message": "Relationship details not found "
            });
        }
    }).catch(err => {
        return res.status(500).send({
             message: err.message
        });
    });
}

exports.addressProofDocList = (req,res) =>{
    
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
    
    var query = 'select LOOKUP_REF_ID "addressProofDocCode", LOOKUP_DESC "addressProofDocName" from LOOKUP_MASTER\
             WHERE LOOKUP_ID = \'KYC_ID_PROOF\' AND LOOKUP_REF_ID IN (\'aadhaar\',\'voterId\',\'drivingLicence\',\'passport\',\'rationCard\')';
             //WHERE LOOKUP_ID = \'KYC_ID_PROOF\' AND LOOKUP_REF_ID IN (\'AADHAAR\',\'VOTERID\',\'DRIVINGLICENSE\',\'PASSPORT\',\'RATIONCARD\')'; 			 
    
    db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT}
    ).then(results=>{
        if(results.length > 0) {
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
        res.status(500).send({
             data:null,
             message: err.message
        });
    });
}


exports.nonindividualAdrProof = (req,res,err) => {

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
    
    var query = 'select lookup_ref_id "addressCode", lookup_desc "addressDesc" from lookup_master\
                 where lookup_id = \'INTRO_DOCUMENT\' AND STATUS != \'DELETED\' AND AUTHORIZED = \'Y\'';
        
    db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT}
    ).then(results=>{
        if(results.length > 0){
            return res.status(200).send({
                "responseCode":sucessCode,
                "response":results
            });
        } else {
            return res.status(200).send({
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

exports.corporates = (req,res,err) => {

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
    
	var query = 'select lookup_ref_id "constitutionCode", lookup_desc "constitutionDesc" from lookup_master a join api_constitution_display_order b \
	on a.lookup_ref_id = b.constitution_key where lookup_id = \'CORPORATE.CUSTOMER_TYPE\' AND STATUS != \'DELETED\' AND AUTHORIZED = \'Y\' order by b.display_order asc';
	
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

exports.title = (req,res,err) => {

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
    
	var query = 'select lookup_ref_id "titleCode", lookup_desc "titleDesc" from lookup_master\
    where lookup_id = \'CUSTOMER.TITLE\' AND STATUS != \'DELETED\' AND AUTHORIZED = \'Y\'';
	
    db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT}
    ).then(results=>{
        if(results.length > 0){
            return res.status(200).send({
                "responseCode":sucessCode,
                "response":results
            });
        } else {
            return res.status(200).send({
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

exports.occupation = (req,res,err) => {

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
    
	var query = 'select lookup_ref_id "occupationCode", UPPER(lookup_desc) "occupationDesc" from lookup_master\
    where lookup_id = \'CUSTOMER.PRIMARYOCCUPATION\' AND STATUS != \'DELETED\' AND AUTHORIZED = \'Y\'';
	
    db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT}
    ).then(results=>{
        if(results.length > 0){
            return res.status(200).send({
                "responseCode":sucessCode,
                "response":results
            });
        } else {
            return res.status(200).send({
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

/*
exports.addressProofDocList = (req,res) =>{
    
    db.sequelize.query("select LOOKUP_REF_ID as \"addressProofDocCode\",LOOKUP_DESC as \"addressProofDocName\" from LOOKUP_MASTER WHERE LOOKUP_ID = 'KYC_ID_PROOF' AND LOOKUP_REF_ID IN ('aadhaar','voterId','drivingLicence','passport','rationCard')", { type: sequelize.QueryTypes.SELECT}).then(results=>{
        if(results.length>0){
            return res.status(200).send({
                "responseCode":"200",
                "response":results
            });
        } else {
            return res.status(200).send({
                "responseCode":"455",
                "message": "Address proof document details not found "
            });
        }
    }).catch(err => {
        return res.status(500).send({
            message: err.message
        });
    });
}

 */