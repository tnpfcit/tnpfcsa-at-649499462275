const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {responseMessage,badRequestcode,
    resourceNotFoundcode,sucessCode} = require('../config/env');

exports.onlineTransaction = (req,res) => {
    var {
        panNumber,
        referenceNumber
    } = req.body;
	
	panNumber = panNumber.toUpperCase();
	referenceNumber =  referenceNumber.toUpperCase();

    logger.info(
       `${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}`
    );

    if(panNumber && referenceNumber){

        var query = 'select cust_id "customerId" from customer where pan_number =:panNumber';
        db.sequelize.query(query,{replacements: {panNumber: panNumber}, type: sequelize.QueryTypes.SELECT}
        ).then(results=>{ console.log(results);
            if(results.length > 0){
                var customerId = results[0].customerId;
				var query = 'select * from PG_RTGS_NEFT_TRANS_DETAILS a where a.customer_id in ( \
							SELECT CUST_ID FROM CUSTOMER WHERE (PAN_NUMBER = :panNumber OR TAN_NO = :panNumber)) \
							and (transaction_id = :referenceNumber or utr_number = :referenceNumber or bank_ref_id=:referenceNumber)';
                
                db.sequelize.query(query,{replacements: {panNumber: panNumber, referenceNumber: referenceNumber}, type: sequelize.QueryTypes.SELECT}
                ).then(results=>{
                    
                   
                    if(results.length>0){
						
                    var bankRefId = results[0].BANK_REF_ID;
					var utrNumber = results[0].UTR_NUMBER;
					
					bankRefId = bankRefId ? bankRefId : null;
					utrNumber = utrNumber ? utrNumber : null;
                                    // var query = 'select transaction_id as reference_no, to_date(to_char(TRANS_DT,\'dd-mon-yyyy\'),\'dd-mm-yyyy\') payment_date,\
                                    // case\
                                    // when TRANS_STATUS = \'Ok\' then \'Success\'\
                                    // when TRANS_STATUS IS NULL then \'Waiting for Confirmation\'\
                                    // when TRANS_STATUS = \'To\' then \'Timed Out\'\
                                    // WHEN TRANS_STATUS = \'F\' THEN \'Failed\' end trans_status,\
                                    // CASE\
                                    // WHEN (TRANS_STATUS =\'Ok\' or TRANS_STATUS IS NULL OR TRANS_STATUS = \'To\') THEN \'-\' ELSE INITCAP(TRANS_REMARKS) END REJECT_REASON,\
                                    // Nvl(deposit_no,\'NA\') deposit_no,\
                                    // (SELECT FILE_NAME FROM CUSTOMER_DOC_DETAILS A WHERE A.CUST_ID = DEPOSIT_NO AND DOC_TYPE = \'fdCertificate\') efdrUrl\
                                    // from RECONB_DEPOSITS_CONS_DATA WHERE MATCH_CONDINTION = \'FMS_1PAY\' AND CLASIFIED_CAT = \'1PAY\' and (transaction_id = \'1589783771786290\' or bank_ref_id = \'1012013414330390666\')\
                                    // union\
                                    // select transaction_id as reference_no, to_date(to_char(TRANS_DT,\'dd-mon-yyyy\'),\'dd-mm-yyyy\') payment_date,\
                                    // case\
                                    // when TRANS_STATUS = \'Ok\' then \'Success\'\
                                    // when TRANS_STATUS IS NULL then \'Waiting for Confirmation\'\
                                    // when TRANS_STATUS = \'To\' then \'Timed Out\'\
                                    // WHEN TRANS_STATUS = \'F\' THEN \'Failed\' end trans_status,\
                                    // CASE\
                                    // WHEN (TRANS_STATUS =\'Ok\' or TRANS_STATUS IS NULL OR TRANS_STATUS = \'To\') THEN \'-\' ELSE INITCAP(TRANS_REMARKS) END REJECT_REASON,\
                                    // Nvl(deposit_no,\'NA\') deposit_no,\
                                    // (SELECT FILE_NAME FROM CUSTOMER_DOC_DETAILS A WHERE A.CUST_ID = DEPOSIT_NO AND DOC_TYPE = \'fdCertificate\') efdrUrl\
                                    // from RECONB_DEPOSITS_CONS_DATA WHERE (MATCH_CONDINTION = \'FMS_RTGS\' or match_condintion = \'FMS_FMS\') AND CLASIFIED_CAT = \'RTGS COLLECTION\'\
                                    // and (transaction_id = \'TNPFCL1593498064561196\' or bank_ref_id = \'KKBKR12020070100865515\')';

                                    /*var query = 'select transaction_id as "referenceNumber", to_date(to_char(TRANS_DT,\'dd-mon-yyyy\'),\'dd-mm-yyyy\') "paymentDate",\
                                    case\
                                    when TRANS_STATUS = \'Ok\' then \'Success\'\
                                    when TRANS_STATUS IS NULL then \'Waiting for Confirmation\'\
                                    when TRANS_STATUS = \'To\' then \'Timed Out\'\
                                    WHEN TRANS_STATUS = \'F\' THEN \'Failed\' end trans_status,\
                                    CASE\
                                    WHEN (TRANS_STATUS =\'Ok\' or TRANS_STATUS IS NULL OR TRANS_STATUS = \'To\') THEN \'-\' ELSE INITCAP(TRANS_REMARKS) END "rejectionReason",\
                                    Nvl(deposit_no,\'NA\') "depositNumber",\
                                    (SELECT FILE_NAME FROM CUSTOMER_DOC_DETAILS A WHERE A.CUST_ID = DEPOSIT_NO AND DOC_TYPE = \'fdCertificate\') "efdrUrl"\
                                    from RECONB_DEPOSITS_CONS_DATA WHERE MATCH_CONDINTION = \'FMS_1PAY\' AND CLASIFIED_CAT = \'1PAY\' and (transaction_id =:referenceNumber or bank_ref_id =:bankRefId)\
                                    union\
                                    select transaction_id as "referenceNumber", to_date(to_char(TRANS_DT,\'dd-mon-yyyy\'),\'dd-mm-yyyy\') "paymentDate",\
                                    case\
                                    when TRANS_STATUS = \'Ok\' then \'Success\'\
                                    when TRANS_STATUS IS NULL then \'Waiting for Confirmation\'\
                                    when TRANS_STATUS = \'To\' then \'Timed Out\'\
                                    WHEN TRANS_STATUS = \'F\' THEN \'Failed\' end "paymentStatus",\
                                    CASE\
                                    WHEN (TRANS_STATUS =\'Ok\' or TRANS_STATUS IS NULL OR TRANS_STATUS = \'To\') THEN \'-\' ELSE INITCAP(TRANS_REMARKS) END "rejectionReason",\
                                    Nvl(deposit_no,\'NA\') "depositNumber",\
                                    (SELECT FILE_NAME FROM CUSTOMER_DOC_DETAILS A WHERE A.CUST_ID = DEPOSIT_NO AND DOC_TYPE = \'fdCertificate\') "efdrUrl"\
                                    from RECONB_DEPOSITS_CONS_DATA WHERE (MATCH_CONDINTION = \'FMS_RTGS\' or match_condintion = \'FMS_FMS\') AND CLASIFIED_CAT = \'RTGS COLLECTION\'
                                    and (transaction_id =:referenceNumber or bank_ref_id =:bankRefId)';*/
									
									var query = 'select transaction_id as "referenceNumber", payment_date as "paymentDate", trans_status as "paymentStatus", rejection_reason as "rejectionReason",\
									nvl(deposit_number,\'-\') as "depositNumber", efdr_url as "efdrUrl" from (\
									select transaction_id ,to_date(to_char(TRANS_DATE,\'dd-mon-yyyy\'),\'dd-mm-yyyy\') payment_date,\
									case\
									when TRANS_STATUS = \'Ok\' then \'Success\'\
									when TRANS_STATUS IS NULL then \'Waiting for Confirmation\'\
									when TRANS_STATUS = \'To\' then \'Timed Out\'\
									WHEN TRANS_STATUS = \'F\' THEN \'Failed\' end trans_status,\
									CASE\
									WHEN (TRANS_STATUS =\'Ok\' or TRANS_STATUS IS NULL OR TRANS_STATUS = \'To\') THEN \'-\' ELSE INITCAP(RESPONSE) END rejection_reason,\
									Nvl(ACCT_NUM,C.DEPOSIT_REF_NO) deposit_number,\
									(SELECT FILE_NAME FROM CUSTOMER_DOC_DETAILS A WHERE A.CUST_ID = Nvl(ACCT_NUM,C.DEPOSIT_REF_NO) AND DOC_TYPE = \'fdCertificate\') efdr_url\
									from pg_rtgs_neft_trans_details a\
									left join reconb_onepay_trans b on a.transaction_id = b.mer_txn_id\
									left join PG_TRANS_MANUAL_DEPOSITS c on a.transaction_id = c.pg_trans_id where\
									(transaction_id =:referenceNumber or bank_ref_id =:bankRefId) and fe_pay_type = \'NETBANKING\'\
									union\
									select transaction_id, to_date(to_char(TRANS_DT,\'dd-mon-yyyy\'),\'dd-mm-yyyy\') payment_date,\
									case when trans_dt is null then \'-\' else \'Success\' end As trans_status,\
									\'-\' as rejection_reason,\
									(select Nvl(deposit_no,\'NA\') from deposit_acinfo where acknwldge_id = fms_ref_id) deposit_number,\
									(SELECT FILE_NAME FROM CUSTOMER_DOC_DETAILS A WHERE A.CUST_ID = (select Nvl(deposit_no,\'NA\')\
									from deposit_acinfo where acknwldge_id = fms_ref_id) AND DOC_TYPE = \'fdCertificate\') efdr_url\
									from pg_rtgs_neft_trans_details a\
									left join recon_electronic_payment b on a.utr_number = b.reference_no\
									WHERE (transaction_id =:referenceNumber or utr_number =:utrNumber) and fe_pay_type = \'RTGS\')t';

                                    db.sequelize.query(query,{replacements: {referenceNumber: referenceNumber,bankRefId: bankRefId,utrNumber: utrNumber}, type: sequelize.QueryTypes.SELECT}
                                    ).then(results=>{

                                        if(results.length>0){

                                            return res.status(200).send({
                                                "responseCode":sucessCode,
                                                "response":results
                                            });
                                        } else {

                                            return res.status(200).send({
                                                "responseCode":resourceNotFoundcode,
                                                "response":"No Matching Records Found"
                                            });

                                        }

                                    }).catch(err =>{

                                        logger.error("selecting record from pg table error ====="+ err);
                                        res.status(500).send({
                                        data:null,
                                        message: err.message
                                        });

                                    });        
                    } else {

                        return res.status(200).send({
                            "responseCode":resourceNotFoundcode,
                            "response":"No matching records available for the entered PAN and transaction / Payment advice number"
                        });

                    }
                }).catch(err =>{

                    res.status(500).send({
                        data:null,
                        message: err.message
                    });

                });
            } else {
                return res.status(200).send({
                    "responseCode":resourceNotFoundcode,
                    "response":"No matching PAN available in the database"
                });
            }
        }).catch(err => {
            logger.error("selecting customer with respect pan number error ====="+ err);
            res.status(500).send({
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