const db = require('../config/db.js');
const sequelize = require('sequelize');
const logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode,NoRecords} = require('../config/env');

exports.depositInterestDetails = (req,res,err) => {
    var {depositNumber,panNumber} = req.body;
	
	panNumber = panNumber.toUpperCase();

    console.log(depositNumber);
 
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);

    if(depositNumber && panNumber){
        
		var query = 'SELECT DEPOSIT_NO FROM DEPOSIT_ACINFO A WHERE CUST_ID IN (SELECT CUST_ID FROM CUSTOMER WHERE \
		             (PAN_NUMBER = :panNumber OR TAN_NO = :panNumber)) AND DEPOSIT_NO = :depositNumber';
                
        db.sequelize.query(query,{replacements:{panNumber:panNumber,depositNumber:depositNumber},type: sequelize.QueryTypes.SELECT}
        ).then(results =>{

            if(results.length > 0){

                   var query = 'select acct_num "depositNumber", nvl(to_char(int_paid_date,\'dd-mm-yyyy\'),\'-\') as "lastIntDate",\
                    nvl(int_amt,0) "lastIntAmt", nvl(tds_amt,0) "tdsAmt", nvl(BANK_INQUIRY_REF_NO,\'NA\') AS "utrNumber",NVL(initcap(INQUIRY_STATUS),\'NA\') as "paymentStatus"\
                    from (select acct_num, int_paid_date,\
                    int_amt , tds_amt , C.BANK_INQUIRY_REF_NO ,case when b.rejected_status = \'Y\' then  inquiry_status else \'Success\' end as inquiry_status\
                    from deposit_interest a join neft_ecs_file_creation b on A.ACT_NUM = B.ACCT_NUM||\'_1\' join electronic_payment_history c on b.utr_number = c.utr_number\
                    and c.api_type = \'INQUIRY\'\
                    where paid_int =\'CREDIT\' and B.SOURCE = \'INTEREST_APPLICATION\' and acct_num =:depositNumber and a.ac_hd_id is not null\
                    and a.int_paid_date = b.trans_dt and a.int_paid_date >=\'01-apr-2020\'\
                    union\
                    select c.act_num , int_paid_date,\
                    c.int_amt, c.tds_amt , \'NA\' ,\'NA\'\
                    from deposit_interest c\
                    where c.paid_int =\'CREDIT\' and c.act_num =:depositNumber||\'_1\' and c.int_paid_date <\'01-apr-2020\') t order by int_paid_date desc';

                    db.sequelize.query(query,{replacements:{depositNumber:depositNumber},type: sequelize.QueryTypes.SELECT}
                    ).then(results =>{

                        if(results.length > 0){
                            return res.status(200).send({
                                "responseCode":sucessCode,
                                "response":results
                            });
                        } else {
                            return res.status(200).send({
                                "responseCode":resourceNotFoundcode,
                                "response":"No record found for the entered Deposit number"
                            });
                        }

                    }).catch(err => {

                        logger.error("selecting deposit interest errors========"+err);
                        return res.status(500).send({
                                data:null,
                                message:err.message
                        });

                    });
            } else {

                return res.status(200).send({
                    "responseCode":resourceNotFoundcode,
                    "response":"No matching records available for the entered PAN and Deposit number"
                });
            }        


        }).catch(err => {

            logger.error(err);
            return res.status(500).send({
                    data:null,
                    message:err.message
            });

        });


    } else {

        return res.status(200).send({
            "responseCode":badRequestcode,
            "response":responseMessage
        });

    }
}