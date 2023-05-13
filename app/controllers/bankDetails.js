const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
let {
   sucessCode,
   badRequestcode,
   resourceNotFoundcode,
   NoRecords,
   responseMessage 
} = require('../config/env.js');

exports.bankcode = (req,res) =>{
   logger.info(`
      ${new Date()} || 
      ${req.originalUrl} || 
      ${JSON.stringify(req.body)} || 
      ${req.ip} || 
      ${req.protocol}
   `);   
   var query = 'select lookup_ref_id as "bankId", initcap(lookup_desc) as "bankName" from (\
               SELECT  LOOKUP_REF_ID, LOOKUP_DESC , B.Successful_trans_count\
               FROM LOOKUP_MASTER a join payment_statistics_summary b on a.lookup_desc = b.bank_name\
               WHERE LOOKUP_ID = \'RTGS.IFSC_BANK_NAME\'\
               union\
               SELECT  DISTINCT LOOKUP_REF_ID , LOOKUP_DESC , 0 AS Successful_trans_count from lookup_master WHERE LOOKUP_dESC NOT IN (SELECT BANK_NAME FROM PAYMENT_STATISTICS_SUMMARY)\
               AND  LOOKUP_ID = \'RTGS.IFSC_BANK_NAME\'  order by Successful_trans_count DESC)t order by rownum';
   db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT}
   ).then(results=>{
      if(results.length > 0){
         return res.status(200).send({
            "responseCode":sucessCode,
            "response":results
         });
      }else{         
         return res.status(200).send({
            "responseCode":resourceNotFoundcode,
            "response":[],
				"message":NoRecords
         });
      }
   }).catch(err => {
      return res.status(500).send({
         data:null,
         message: err.message
      });
   });
}

exports.bankstates = (req,res) =>{     
   let bankCode = req.body.bankCode;
   logger.info(`
      ${new Date()} || 
      ${req.originalUrl} || 
      ${JSON.stringify(req.body)} || 
      ${req.ip} || 
      ${req.protocol}
   `);
     
      if(bankCode)
         {
         let query = "SELECT DISTINCT STATE AS \"state\" FROM IFSC_BANK_BRANCH WHERE BANK_CODE=:bankCode";         
         db.sequelize.query(query,{replacements:{bankCode:bankCode}, type: sequelize.QueryTypes.SELECT}
         ).then(results=>{
            if(results.length > 0)
            {               
               return res.status(200).send({
                  "responseCode":sucessCode,
                  "response":results
               });
            }else{              
               return res.status(200).send({
                  "responseCode":resourceNotFoundcode,
                  "response":[],
                  "message": NoRecords
               });
           }
         }).catch(err => {
            return res.status(500).send({
               data:null,
               message: err.message
            });
         });
      }else{         
         return res.status(200).send({
            "responseCode":badRequestcode,
            "response":responseMessage
         });
      }
}
          
exports.bankcities = (req,res) =>{   
   let {
         bankCode,
         state
    } = req.body;
   logger.info(`
      ${new Date()} || 
      ${req.originalUrl} || 
      ${JSON.stringify(req.body)} || 
      ${req.ip} || 
      ${req.protocol}
   `); 
   
   if(bankCode && state){
      let query = "SELECT DISTINCT CITY AS \"city\" FROM IFSC_BANK_BRANCH WHERE BANK_CODE=:bankCode AND STATE =:state";      
      db.sequelize.query(query,
         {replacements:{
            bankCode:bankCode, 
            state:state 
         }, type: sequelize.QueryTypes.SELECT }
      ).then(results=>{         
         if(results.length > 0){            
            return res.status(200).send({
               "responseCode":sucessCode,
               "response":results
            });
         }else{            
            return res.status(200).send({
               "responseCode":resourceNotFoundcode,
               "response":[],
               "message":NoRecords
            });
         }
      }).catch(err => {
         return res.status(500).send({
            message: err.message
         });
      });
   } else {      
      return res.status(200).send({
         "responseCode":badRequestcode,
         "response":responseMessage
      });
   }
}

 exports.bankbranch = (req,res) =>{
   let {
         bankCode,
         state,
         city
   } = req.body;
   logger.info(`
      ${new Date()} || 
      ${req.originalUrl} || 
      ${JSON.stringify(req.body)} || 
      ${req.ip} || 
      ${req.protocol}
   `);

   if(bankCode && state && city){
      var query = "SELECT DISTINCT BRANCH_NAME AS \"branchName\" FROM IFSC_BANK_BRANCH WHERE BANK_CODE=:bankCode AND STATE =:state AND CITY =:city";      
      db.sequelize.query(query,
         {replacements:{
            bankCode:bankCode, 
            state:state, 
            city:city 
         }, type: sequelize.QueryTypes.SELECT}
      ).then(results=>{         
         if(results.length > 0){                  
            return res.status(200).send({
               "responseCode":sucessCode,
               "response":results
            });
         }else{            
            return res.status(200).send({
               "responseCode":resourceNotFoundcode,
               "response":[],
               "message":NoRecords
            });
         }
      }).catch(err => {         
         return res.status(500).send({
            data:null,
            message: err.message
         });
      });
   } else {
     return res.status(200).send({
        "responseCode":badRequestcode,
        "response":responseMessage
      });
   }
}
exports.bankifsccode = (req,res) =>{   
   let {
      bankCode,
      state,
      city,
      branchName
   } = req.body;
   logger.info(`
      ${new Date()} || 
      ${req.originalUrl} || 
      ${JSON.stringify(req.body)} || 
      ${req.ip} || 
      ${req.protocol}
   `);
   if(bankCode && state && city && branchName){      
      let query = "SELECT DISTINCT IFSC_CODE AS \"ifscCode\",MICR_CODE AS \"micrCode\" FROM IFSC_BANK_BRANCH WHERE BANK_CODE=:bankCode AND STATE =:state AND CITY =:city AND BRANCH_NAME =:branchName";      
      db.sequelize.query(query,
         {replacements:{
            bankCode:bankCode, 
            state:state, 
            city:city, 
            branchName:branchName
         }, type: sequelize.QueryTypes.SELECT}
      ).then(results => {         
         if(results.length > 0){            
            return res.status(200).send({
               "responseCode":sucessCode,
               "response":results
            });
         }else{            
            return res.status(200).send({
               "responseCode":resourceNotFoundcode,
               "response":[],
               "message":NoRecords
            });
         }
      }).catch(err => {
         res.status(500).send({
            data:null,
            message: err.message
         });
      });
   }else{      
      return res.status(200).send({
        "responseCode":badRequestcode,
        "response":responseMessage
      });
   }
}

exports.details = (req,res) =>{   
   let ifscCode = req.body.ifscCode;
   ifscCode = ifscCode.toUpperCase();   
   if(ifscCode){
      let query = "SELECT DISTINCT IFSC_CODE AS \"ifscCode\",MICR_CODE AS \"micrCode\",BRANCH_NAME AS \"branchName\",ADDRESS AS \"address\",CITY AS \"city\",STATE AS \"state\",BANK_CODE AS \"bankCode\",LOOKUP_DESC AS \"bankName\" FROM IFSC_BANK_BRANCH IBB  JOIN LOOKUP_MASTER LM ON IBB.BANK_CODE = LM.LOOKUP_REF_ID WHERE LOOKUP_ID = 'RTGS.IFSC_BANK_NAME' AND IFSC_CODE =:ifscCode";      
      db.sequelize.query(query,
         {replacements:{
            ifscCode:ifscCode
         },type: sequelize.QueryTypes.SELECT}
      ).then(results=>{         
         if(results.length > 0){            
            return res.status(200).send({
               "responseCode":sucessCode,
               "response":results
            });
         }else{            
            return res.status(200).send({
               "responseCode":resourceNotFoundcode,
               "response":"IFSC code not available in database. Contact customersupport@tnpowerfinance.com"
            });
         }
      }).catch(err => {         
         return res.status(500).send({
            data:null,
            message: err.message
         });
      });
   }else{
      return res.status(200).send({
         "responseCode":badRequestcode,
         "response":responseMessage
      });
   }
}