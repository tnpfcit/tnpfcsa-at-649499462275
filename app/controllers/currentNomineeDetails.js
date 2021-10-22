const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode,NoRecords} = require('../config/env');


exports.nomineeDetails = (req,res) =>{
    var customerId = req.body.customerId;

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);

    if(!customerId){

        return res.status(200).send({
            "responseCode":badRequestcode,
            "response":responseMessage
        });
    }
     
    var query = 'select a.deposit_no "depositNumber", a.nominee_name "nomineeName", a.relationship "relationship", a.nominee_dob "nomineeDob", a.guardian_name "guardianName", g_relationship "guardianRelationship", get_nominee_relation(relationship) "nomineeRelationshipDesc", get_nominee_relation(g_relationship) "guardianRelationshipDesc" from deposit_nominee_detail a\
    join deposit_acinfo b on a.deposit_no = b.deposit_no and b.cust_id =:customerId  and b.deposit_status IN (\'NEW\',\'MATURED\')'; 
    

    db.sequelize.query(query,{replacements:{customerId:customerId},type: sequelize.QueryTypes.SELECT}
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
            logger.error(err);
            res.status(500).send({
                data:null,
                message: err.message
            });
    });
   
}