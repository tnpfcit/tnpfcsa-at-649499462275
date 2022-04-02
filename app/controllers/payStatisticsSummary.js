const db = require('../config/db.js');
const sequelize = require('sequelize');
const logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode,NoRecords} = require('../config/env');

exports.statisticsSummary = (req,res,err) => {

    logger.info(`${new Date()} || ${req.originalUrl} || ${JSON.stringify(req.body)} || ${req.ip} || ${req.protocol}`);
    var query = 'select bank_name "bankName",successful_trans_count "sucessCount",successful_trans_percent "sucessPercent",\
                failure_trans_count "failureCount",failure_trans_percent "failurePercent"\
                from payment_statistics_summary order by successful_trans_count desc';
    
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