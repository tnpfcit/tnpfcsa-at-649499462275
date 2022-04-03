const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var deposit_bank_creation = db.depositbankcreation;
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode} = require('../config/env');


exports.depositbank = (req,res) =>{
		let {
			depositNumber,
			bankAccountNumber,
			bankCode,
			bankName,
			branchName,
			accHolderName,
			ifscCode,
			micrCode
		} = req.body;
		logger.info(`
			${new Date()} || 
			${req.originalUrl} || 
			${JSON.stringify(req.body)} || 
			${req.ip} || 
			${req.protocol} || 
			${req.method}
		`);
		deposit_bank_creation.findAll({where:{ACCOUNT_NO: bankAccountNumber}}).then(results=>{
			if(results.length>0){
				return res.status(200).send({
                "responseCode":sucessCode,
                "response":"AccountNumber already exists"
				});
			}
			else{
				deposit_bank_creation.build({ 
				DEPOSIT_NO: depositNumber, 
				ACCOUNT_NO:bankAccountNumber,
				BANK_CODE:bankCode,
				BANK_NAME:bankName,
				BRANCH_NAME:branchName,
				CUST_NAME:accHolderName,
				IFSC_CODE:ifscCode,
				MICR_CODE:micrCode,
				NEFT_ECS:'N',
				STATUS:"CREATED",
				STATUS_BY:"SYSUSER",
				STATUS_DT:new Date(),
				}).save().then(results => {
					return res.status(200).send({
                        "responseCode":sucessCode,
                        "response":"data saved sucessfully"
                    });
				}).catch(err => {
					return res.status(500).send({
					data:null, message: err.message
					});
				});
			}
		}).catch(err => { 
			return res.status(500).send({
            data:null, 
            message: err.message
			});
		});
	}
