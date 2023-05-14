const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {
   sucessCode,
   resourceNotFoundcode,
   badRequestcode,
   responseMessage
} = require('../config/env');

exports.statusRequest = (req,res) =>{   
   var customerId = req.body.customerId;
   logger.info(`
      ${res.StatusCode} || 
      ${new Date()} || 
      ${req.originalUrl} || 
      ${JSON.stringify(req.body)} || 
      ${req.ip} || 
      ${req.protocol} || 
      ${req.method}
   `);   
   if(customerId){         
      db.sequelize.query("SELECT a.ACKNWLDGE_ID AS \"acknowledgementId\", a.PURPOSE AS \"purpose\", a.DEPOSIT_NUM AS \"depositNumber\", a.STATUS AS \"status\" \
			FROM ACKNOWLEDGEMENT a WHERE a.CUST_ID=:customerId \
			UNION ALL\
			SELECT b.ACKNWLDGE_ID AS \"acknowledgementId\", 'Form 15G&H Submission' as \"purpose\", b.deposit_no as \"depositNumber\", case when b.authorize_status is null then b.status else initcap(b.authorize_status) end as \"status\"\
			FROM web_portal_ack_master a JOIN web_portal_g b ON a.acknwldge_id = b.acknwldge_id where b.cust_id=:customerId\
			UNION ALL\
			SELECT b.ACKNWLDGE_ID AS \"acknowledgementId\", 'Address Change' as \"purpose\", null as \"depositNumber\", case when b.authorize_status is null then b.status else initcap(b.authorize_status) end as \"status\"\
			FROM web_portal_ack_master a JOIN web_portal_customer b ON a.acknwldge_id = b.acknwldge_id where b.cust_id=:customerId\
			UNION ALL\
			SELECT b.ACKNWLDGE_ID AS \"acknowledgementId\", 'Nominee Change' as \"purpose\", b.deposit_no as \"depositNumber\", case when b.authorize_status is null then b.status else initcap(b.authorize_status) end as \"status\"\
			FROM web_portal_ack_master a JOIN web_portal_dep_nominee_detail b ON a.acknwldge_id = b.acknwldge_id where b.cust_id=:customerId\
			UNION ALL\
			SELECT b.ACKNWLDGE_ID AS \"acknowledgementId\", 'Bank Details Change' as \"purpose\", b.deposit_no as \"depositNumber\", case when b.authorize_status is null then b.status else initcap(b.authorize_status) end as \"status\"\
			FROM web_portal_ack_master a JOIN web_portal_dep_other_bank b ON a.acknwldge_id = b.acknwldge_id where b.cust_id=:customerId",
         {replacements: {customerId: customerId}, type: sequelize.QueryTypes.SELECT}
      ).then(results=>{         
         if(results.length > 0){
            return res.status(200).send({
               "responseCode":sucessCode,
               "response":results
            });
         }else{            
            return res.status(200).send({
               "responseCode":resourceNotFoundcode,
               "response":[]
            });
         }
      }).catch(err => {         
         res.status(500).send({
            message: err.message
         });         
      });
   }else{
      return res.status(400).send({
         "responseCode":badRequestcode,
         "response":responseMessage
      });
   }
} 