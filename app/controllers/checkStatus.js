const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {
    responseMessage,
    sucessCode,
    badRequestcode,
    resourceNotFoundcode,
    NoRecords
} = require('../config/env');

exports.chequeInformation = (req,res) => {

    var {panNumber,chequeNumber,bankId} = req.body;
	
	panNumber = panNumber.toUpperCase();

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);

    if(panNumber && chequeNumber && bankId){
        var query = 'select * from customer where NVL(pan_number,TAN_NO) =:panNumber';
        db.sequelize.query(query,{replacements:{panNumber:panNumber},type: sequelize.QueryTypes.SELECT}
        ).then(results =>{
                if(results.length > 0){
                    var query = 'select a.cheque_num AS "chequeNumber", nvl(to_char(cheque_cleared_dt,\'dd-mm-yyyy\'),\'-\') as "clearanceDate",\
                    case when cheque_status = \'F\' then \'Returned/Rejected\' when cheque_status is null then \'Awaiting Clearance Status\'\
                    else \'Cleared\' END as "paymentStatus", nvl(b.bouncing_reason,\'-\') as "rejectReason", nvl(c.deposit_no,\'NA\') as "depositNumber",\
                    E.FILE_NAME as efdrUrl\
                    from ack_cheque_details a\
                    join acknowledgement d on a.acknwldge_id = d.acknwldge_id and d.status !=\'DELETED\' and d.purpose in (\'NEW_DEPOSIT\',\'RENEWAL\',\'%LOAN%\',\'OTHERS\')\
                    left join ack_bounce_details b on a.cc_id = b.cc_id and a.cheque_num = b.cheque_num\
                    left join deposit_acinfo c on A.ACKNWLDGE_ID = C.ACKNWLDGE_ID and c.status !=\'DELETED\'\
                    left join customer_doc_Details e on c.deposit_no = e.cust_id and doc_type = \'fdCertificate\'\
                    WHERE D.PAN_NO =:panNumber AND A.CHEQUE_NUM =:chequeNumber and drawn_on_bank =:bankId';
                    db.sequelize.query(query,{replacements:{panNumber:panNumber,chequeNumber:chequeNumber,bankId:bankId},type: sequelize.QueryTypes.SELECT}
                    ).then(results =>{
                        console.log(results);
                        if(results.length > 0){
                            return res.status(200).send({
                                "responseCode":sucessCode,
                                "response":results
                            });
                        } else {
                            return res.status(200).send({
                                "responseCode":resourceNotFoundcode,
                                "response":"No records found"
                            });
                        }

                    }).catch(err => {

                        logger.error("selecting record query error==="+err);
                        return res.status(500).send({
                                data:null,
                                message:err.message
                        });

                    });


                } else {
                    return res.status(200).send({
                        "responseCode":resourceNotFoundcode,
                        "response":"Pan number not registered with us"
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