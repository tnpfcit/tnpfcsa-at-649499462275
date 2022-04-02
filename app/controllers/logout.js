const db = require('../config/db.js');
const sequelize = require('sequelize');
var http = require('http');
var urlencode = require('urlencode');
const MaskData = require('maskdata');
var request = require('request');
var moment = require('moment');
var logut = db.logged;
var {responseMessage,username,hash,sender,sucessCode,badRequestcode,resourceNotFoundcode,NoRecords} = require('../config/env');
const logger = require('../config/logger.js');


exports.logout = (req,res) => {
    var {customerId,channel} = req.body;
        if(customerId){
            var query = 'select decode (c.cust_type,\'INDIVIDUAL\',c.fname,c.comp_name) as "depositorName",cp.phone_number from customer c join cust_phone cp on c.cust_id = cp.cust_id where c.cust_id =:customerId';
            db.sequelize.query(query,{replacements:{customerId:customerId},type: sequelize.QueryTypes.SELECT}
            ).then(results=>{
                if(results.length > 0){
                    //var depName = results[0].FNAME;
					var depName = results[0].depositorName.length>16? results[0].depositorName.substring(0,16):results[0].depositorName;
                    var phNumber = results[0].PHONE_NUMBER;
                    var currDate = String(moment(new Date()).format('DD-MM-YYYY HH:mm:ss'));
                    logut.update({LOG_OUT:currDate},{ where: {USER_ID:customerId}}).then(results => {
						if(channel == 'app'){
                            var msg = urlencode('Dear '+depName+', You have logged-out of TNPFCL Mobile App on '+currDate+' For any issues contact our 24x7 interactive voice response system phone number 044-46312345');
                        } else {
                            var msg = urlencode('Dear '+depName+', You have logged-out of TNPF Web Portal for Depositors on '+currDate+' For any issues contact our 24x7 interactive voice response system phone number 044-46312345');
                        }
                        var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phNumber + '&message=' + msg;
                        request.get("https://api.textlocal.in/send?"+ data, (error, response, body) => {});
                        return res.status(200).send({
                            "responseCode":sucessCode,
                            "response":"You are Sucessfully Logged Out"
                        });
                    }).catch(err => {
                        res.status(500).send({
                            data:null,
                            message: err.message
                        });
                    });
                } else {
                    return res.status(404).send({
                        "responseCode":resourceNotFoundcode,
                        "response":NoRecords
                    });
                }
            }).catch(err => {
                logger.error(err);
                res.status(500).send({
                    data:null,
                    message:err.message
                });
            });
        } else {
            return res.status(400).send({
                "responseCode":badRequestcode,
                "response":responseMessage
            });
        }
}
