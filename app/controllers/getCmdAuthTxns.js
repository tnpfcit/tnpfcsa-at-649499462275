const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger.js');
var {
   sucessCode,
   resourceNotFoundcode,
   badRequestcode,
   responseMessage
} = require('../config/env.js');

exports.cmdAuthTxns = (req,res) =>{
   var {
      roleId,
      purpose,
      transtype
   }= req.body;
   console.log ("body =============="+JSON.stringify(req.body));

   logger.info(`
      ${res.StatusCode} || 
      ${new Date()} || 
      ${req.originalUrl} || 
      ${JSON.stringify(req.body)} || 
      ${req.ip} || 
      ${req.protocol} || 
      ${req.method}
   `);   
   if(roleId =='ROL02'&& purpose){	   
		var query='select a.purpose "purpose",a.act_num "txnRefNo",\
      C.AC_HD_DESC "acHdDesc",b.batch_id "batchId",b.trans_dt "transDt",b.amount "amount",b.trans_type "transType",\
      case when b.particulars = b.narration then b.particulars else \'Particulars:\'||b.particulars ||\'; Narration:\'||b.narration end "remarks",\
      case a.gm_auth_status when NULL THEN \'PENDING\' WHEN \'A\' THEN \'APPROVED\' WHEN \'R\' THEN \'REJECTED\' END "cfoApprovalStatus",\
      a.gm_remarks "cfoRemarks",\
      case a.cmd_auth_status when NULL THEN \'PENDING\' WHEN \'A\' THEN \'APPROVED\' WHEN \'R\' THEN \'REJECTED\' END "cmdApprovalStatus",\
      a.cmd_remarks "cmdRemarks",\
	  GETUTR_NUMBER_BASED_STATUS(SHIFT,1) "paymentStatus"\
      from approval_master a join transfer_trans b on a.batch_id = b.batch_id and a.trans_dt = b.trans_dt\
      JOIN AC_HD C ON B.AC_HD_ID = C.AC_HD_ID  where cmd_approval_req=\'Y\' AND CMD_AUTH_STATUS IS NOT NULL\
      AND B.TRANS_DT >= add_months((select curr_appl_dt from day_end),-2) and a.purpose =:purposedesc  order by cmd_timestamp desc,b.trans_dt desc, b.batch_id,b.trans_id';
	   
		db.sequelize.query(query,{replacements: {purposedesc: purpose}, type: sequelize.QueryTypes.SELECT}
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