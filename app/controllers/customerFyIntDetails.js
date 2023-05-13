const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {
   sucessCode,
   resourceNotFoundcode,
   badRequestcode,
   responseMessage
} = require('../config/env');

exports.customerFYIntDetails = (req,res) =>{
   
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
		var query='select substr(to_char(GETFINANCIALstartdt(int_paid_date),\'dd-mm-yyyy\'),7,4)||\'-\'||\
		substr(to_char(GETFINANCIALENDDT(int_paid_date),\'dd-mm-yyyy\'),7,4)"financialYear", ROUND(sum(int_amt),0) "intTotal",ROUND(sum(tds_amt),0) "tdsTotal"\
		from deposit_interest A  LEFT JOIN NEFT_eCS_FILE_CREATION B ON SUBSTR(A.ACT_NUM,1,13) = B.ACCT_NUM  AND A.INT_PAID_DATE = TRANS_DT\
		where cust_id =:customerId and paid_int = \'CREDIT\' AND (TRANS_LOG_ID IS NULL OR TRANS_LOG_ID NOT IN (\'PRE_CLOSE_RECEIVABLE\',\'DEATH_CLOSE_RECEIVABLE\',\'REC_FROM_CUSTOMER\'))group by\ substr(to_char(GETFINANCIALstartdt(int_paid_date),\'dd-mm-yyyy\'),7,4)||\'-\'||substr(to_char(GETFINANCIALENDDT(int_paid_date),\'dd-mm-yyyy\'),7,4) ORDER BY 1 DESC';
	   
		db.sequelize.query(query,{replacements: {customerId: customerId}, type: sequelize.QueryTypes.SELECT}
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