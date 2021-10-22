const db = require('../config/db.js');
const sequelize = require('sequelize');
const logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode,NoRecords} = require('../config/env');

exports.rejectionSummary = (req,res,err) => {

    logger.info(`${new Date()} || ${req.originalUrl} || ${JSON.stringify(req.body)} || ${req.ip} || ${req.protocol}`);
    var query = 'select sum(total_count) "totalCount", round((sum(total_count) /(select sum(total_count) from payment_rejection_statistics))*100,2) "rejectionPercentage",\
                 revised_rejection_reason "revisedRejectionReason" from PAYMENT_REJECTION_STATISTICS group by revised_rejection_reason order by 1 desc';
    
    db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT}
    ).then(results=>{
        logger.info("interest results=========="+JSON.stringify(results));
        if(results.length > 0){
            
            return res.status(200).send({
                "responseCode":sucessCode,
                "response":results
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
            message: err.message
        });
    }); 
}