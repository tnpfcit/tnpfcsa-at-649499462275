const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var http = require('http');
var urlencode = require('urlencode');
var request = require('request');
const { v4: uuidv4 } = require('uuid');
var {existurl,key,iv,appkey,appiv,appmerchantId,sucessCode,responseMessage,badRequestcode} = require('../config/env.js');
var test = 'https://pay.1paypg.in/onepayVAS/getTxnDetails?merchantId=';
//var test = 'https://hdfcprodsigning.in/onepayVAS/getTxnDetails?merchantId=';


exports.transactionStatus = (req, res, err) => {
	
	var query = 'select * from pg_rtgs_neft_trans_details where to_char(created_dt,\'dd-mm-yyyy\') = (select to_char(sysdate,\'dd-mm-yyyy\') from dual) and status is null and fe_pay_type = \'NETBANKING\' AND TRANSACTION_ID NOT IN (SELECT TXN_ID FROM ONE_PAY_TRANS_STATUS_DETAILS)';
    
    //var query = 'select * from pg_rtgs_neft_trans_details where /*to_char(created_dt,\'dd-mm-yyyy\') = \'11-06-2020\'/*(select to_char(sysdate,\'dd-mm-yyyy\') from dual) and*/  status is null and fe_pay_type = \'NETBANKING\' AND TRANSACTION_ID NOT IN (SELECT TXN_ID FROM ONE_PAY_TRANS_STATUS_DETAILS)';  
    
    function resolveAfter2Seconds() {
        return new Promise(resolve => {
            setTimeout(() => {
                db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT}
                ).then(results =>{
                    if(results.length > 0){
                        if (results instanceof Array) {
                            results = results.map(element => element.TRANSACTION_ID);
                        }
                            var length = results.length;
                            console.log(length);
                            for(i=0;i<length;i++){
                                var merchantId = 'M00034';
                                request.post(test+merchantId+'&txnId='+results[i], (error, response, body) => {
                                    if(response.body && response.statusCode !== 500){ 
                                        var id = JSON.parse(response.body);
                                        var msg = id.resp_message;
                                        console.log("message ============="+ msg);
                                        if(msg == 'Invalid Merchant ID or Txn ID'){
                                            merchantId = 'M00035';
                                            request.post(test+merchantId+'&txnId='+results[i], (error, response, body) => {
                                                if(response.body && response.statusCode !== 500){ 
                                                    var id = JSON.parse(response.body);
                                                    var uid = uuidv4();
                                                    db.sequelize.query("INSERT INTO ONE_PAY_TRANS_STATUS_DETAILS (payment_mode,resp_message,udf5,cust_email_id,udf3,merchant_id,txn_amount,udf4,udf1,udf2,pg_ref_id,txn_id,resp_date_time,bank_ref_id,resp_code,txn_date_time,trans_status,cust_mobile_no) VALUES('" + id.payment_mode + "','" + id.resp_message + "','" + id.udf5 + "','" + id.cust_email_id + "','" + id.udf3 + "','" + id.merchant_id + "','" + id.txn_amount + "','" + id.udf4 + "','" + id.udf1 + "','" + id.udf2 + "','" + id.pg_ref_id + "','" + id.txn_id + "','" + id.resp_date_time + "','" + id.bank_ref_id + "','" + id.resp_code + "','" + id.txn_date_time + "','" + id.trans_status + "','" + id.cust_mobile_no + "')").then(results=>{
                                                    })
                                                } else {
                                                    return res.status(500).send({"response":"Technical Error. Try again later"});
                                                }
                                            })        
                                        } else {
                                            var uid = uuidv4();
                                            console.log("uid===="+uid);
                                            db.sequelize.query("INSERT INTO ONE_PAY_TRANS_STATUS_DETAILS (payment_mode,resp_message,udf5,cust_email_id,udf3,merchant_id,txn_amount,udf4,udf1,udf2,pg_ref_id,txn_id,resp_date_time,bank_ref_id,resp_code,txn_date_time,trans_status,cust_mobile_no) VALUES('" + id.payment_mode + "','" + id.resp_message + "','" + id.udf5 + "','" + id.cust_email_id + "','" + id.udf3 + "','" + id.merchant_id + "','" + id.txn_amount + "','" + id.udf4 + "','" + id.udf1 + "','" + id.udf2 + "','" + id.pg_ref_id + "','" + id.txn_id + "','" + id.resp_date_time + "','" + id.bank_ref_id + "','" + id.resp_code + "','" + id.txn_date_time + "','" + id.trans_status + "','" + id.cust_mobile_no + "')").then(results=>{
                                            });
                                        }
                                    } else {
                                        return res.status(500).send({"response":"Technical Error. Try again later"});
                                    }
                                }) 
                            }
                            var result = "sucess";
                            resolve(result);
                        } else {
                            var result = "one pay transaction status details not found";  
                            resolve(result);
                        }
                            //var result = "sucess";
                            //resolve(result);
                }).catch(err => {res.status(500).send({data:null, message:err.message});});
            },5000);
        });
      }

      async function asyncCall() {
        const result = await resolveAfter2Seconds();
        res.send("sucess");
      }
      
      asyncCall();
}
