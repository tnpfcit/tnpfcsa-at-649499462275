const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger.js');
var {
   sucessCode,
   resourceNotFoundcode,
   badRequestcode,
   responseMessage
} = require('../config/env.js');

exports.cfoAuthTxns = (req,res) =>{
   var {
      roleId      
   }= req.body;

   logger.info(`
      ${res.StatusCode} || 
      ${new Date()} || 
      ${req.originalUrl} || 
      ${JSON.stringify(req.body)} || 
      ${req.ip} || 
      ${req.protocol} || 
      ${req.method}
   `);   
   if(roleId=='ROL02'){	   
		var query='select purpose "purpose",txn_ref_no "txnRefNo", ac_hd_desc "acHdDesc",batch_id "batchId",trans_Dt "transDt",amount "amount",trans_type "transType",remarks "remarks",\
       cfo_approval_status "cfoAppStatus", cfo_remarks "cfoRemarks", authorize_by "authorizeBy", payment_status "paymentStatus" from api_cfo_authorized_txns order by  trans_Dt desc, batch_id';
	   
		db.sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}
      ).then(results=>{
         if(results.length > 0){
            return res.status(200).send({
               "responseCode":sucessCode,
               "response":results
            });
         } else {
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
   } else {
      return res.status(400).send({
         "responseCode":badRequestcode,
         "response":responseMessage
      });
   }
} 