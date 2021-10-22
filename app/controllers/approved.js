const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var approveMasterTable = db.approve;
var moment = require('moment');

exports.approving = (req,res) =>{
    var { accountNumber,userId,remarks,userStatus,batchId,transactionAmount,roleId,purpose,transDt } = req.body;
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
    if (accountNumber && userId && remarks && userStatus && batchId && transactionAmount && roleId && purpose && transDt){
		db.sequelize.query('select API_MANAGEMENT_APPROVAL(:accountNumber,:userId,:remarks,:userStatus,:batchId,:transactionAmount,:roleId,:purpose,:transDt) as accountNumber from dual',
            {replacements: {accountNumber: accountNumber, userId: userId, remarks: remarks, userStatus: userStatus, batchId: batchId, transactionAmount: transactionAmount,roleId: roleId,purpose: purpose, transDt: transDt},
            type: sequelize.QueryTypes.SELECT}
        ).then(results => {
            console.log(results);
            return res.status(200).send({"responseCode":"200","response":"updated sucessfully"}); 
        }).catch(err => {res.status(500).send({message: err.message});});
    } else {
        return res.status(400).send({"responseCode":"400","response":"bad request check payload"});
    }
}

