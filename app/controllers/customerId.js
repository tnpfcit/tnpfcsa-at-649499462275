const db = require('../config/db.js');
const sequelize = require('sequelize');
const logger = require('../config/logger');

exports.customer = (req,res,err) => {
    var panNumber = req.body.panNumber;
    
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
    $   {req.ip} || ${req.protocol}
    `);
    var query = 'select cust_id from customer where pan_number =:panNumber';
    
    db.sequelize.query(query,{replacements:{panNumber:panNumber},type: sequelize.QueryTypes.SELECT}
    ).then(results=>{
        var customerId = results[0].CUST_ID;
        return res.status(200).send({
            "responseCode":"200",
            "response":[{customerId}]
        });
    }).catch(err => {
        logger.error(err);
        res.status(500).send({
            message: err.message
        });
    }); 
}