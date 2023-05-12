const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {
   sucessCode,
   resourceNotFoundcode,
   badRequestcode,
   responseMessage
} = require('../config/env');

exports.customerInterestDetails = (req,res) =>{
   
   var customerId = req.body.customerId;
   var fyYear = req.body.fyYear;

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
	   
	   var query='select SUBSTR(ACT_NUM,1,13) "depositNo", TO_CHAR(INT_DT,\'DD-MON-YYYY\') "IntfromDate", TO_CHAR(APPL_DT,\'DD-MON-YYYY\') "InToDate", INT_AMT "GrossIntAmt",TDS_AMT "tdsAmt", BANK_INQUIRY_REF_NO "txnRefNo", INQUIRY_STATUS "txnStatus",\
	   SUBSTR(TO_CHAR(GETFINANCIALSTARTDT(INT_PAID_DATE),\'dd-mm-yyyy\'),7,4)||\'-\'||\
	   SUBSTR(to_char(GETFINANCIALENDDT(INT_PAID_DATE),\'dd-mm-yyyy\'),7,4)"financialYear"\
	   FROM DEPOSIT_INTEREST A LEFT JOIN NEFT_ECS_FILE_CREATION B ON SUBSTR(A.ACT_NUM,1,13) = B.ACCT_NUM AND A.INT_PAID_DATE = TRANS_DT \
	   LEFT JOIN ELECTRONIC_PAYMENT_HISTORY C ON B.UTR_NUMBER=C.UTR_NUMBER AND API_TYPE = \'INQUIRY\'\
	   WHERE PAID_INT = \'CREDIT\' AND A.INT_PAID_DATE BETWEEN TO_DATE(\'01-APR-\'||SUBSTR(:fyYear,1,4)) and TO_DATE(\'31-MAR-\'||SUBSTR(:fyYear,6,4))\
	   AND A.CUST_ID=:customerId';
	   
		db.sequelize.query(query,{replacements: {customerId: customerId,fyYear: fyYear}, type: sequelize.QueryTypes.SELECT}
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