const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
const moment = require('moment');
//var approveMasterTable = db.approve;

exports.transferApproval = (req,res) =>{
    var { userId,remarks,userStatus,batchId,purpose,transDt,roleId} = req.body;
		transDt = moment(transDt).format('DD-MMM-YYYY');
	logger.info(`
        ${res.StatusCode} || 
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
		console.log("dt"+transDt);
        if(userId && remarks && userStatus && batchId && purpose){
            db.sequelize.query('select API_IPAD_TRANSFER_APPROVAL (:userId,:remarks,:userStatus,:batchId,:purpose,:transDt,:roleId) as batchId from dual',
                {replacements: {userId: userId, remarks: remarks, userStatus: userStatus, batchId: batchId, purpose: purpose,transDt: transDt,roleId: roleId},
                type: sequelize.QueryTypes.SELECT}
            ).then(results => {
                return res.status(200).send({"responseCode":"200", "response":"Updated sucessfully"});
            }).catch(err => {res.status(500).send({message: err.message});});
        } else {
            return res.status(400).send({"responseCode":"400","response":"Bad request check payload"});
        }
}