const db = require('../config/db.js');
const sequelize = require('sequelize');
const logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode,NoRecords} = require('../config/env');

exports.fdInterest = (req,res,err) => {
    var depositNumber = req.body.accountNumber +'_1';
    logger.info(depositNumber);
    logger.info(`${new Date()} || ${req.originalUrl} || ${JSON.stringify(req.body)} || ${req.ip} || ${req.protocol}`);
    
    
    if(!depositNumber){
        return res.status(400).send({"responseCode":badRequestcode,"response":responseMessage});
    }
    
    var query = 'select substr(act_num,1,13) "depositNumber", TO_CHAR(int_paid_date,\'DD-MM-YYYY\') "lastIntDate", nvl(round(int_amt,0),0) "lastIntAmt", nvl(round(tds_amt,0),0) "tdsAmt" from deposit_interest where act_num =:depositNumber and paid_int =\'CREDIT\'';
    
    db.sequelize.query(query,{replacements:{depositNumber:depositNumber},type: sequelize.QueryTypes.SELECT}
    ).then(results=>{
        logger.info("interest results=========="+JSON.stringify(results));
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