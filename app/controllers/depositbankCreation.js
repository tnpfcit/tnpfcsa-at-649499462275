const db = require('../config/db.js');
const sequelize = require('sequelize');
//const deptvalidation = require('../middleware/depositbankvalidation.js');
var deposit_bank_creation = db.depositbankcreation;
//const { validationResult } = require('express-validator');


exports.depositbank = (req,res) =>{

   // const errors = validationResult(req);
    //deptvalidation.validates('deposit');
    //if (!errors.isEmpty()) {res.status(200).json({"message":"ok", "responseCode":"405",errors: errors.array()});return;}

    var {depositNumber,bankAccountNumber,bankCode,bankName,branchName,accHolderName,ifscCode,micrCode} = req.body;
    //console.log(depositNumber);

    deposit_bank_creation.findAll({where:{ACCOUNT_NO: bankAccountNumber}}).then(results=>{
        if(results.length>0)
        {
            return res.status(200).send({"message":"ok","responseCode":"200","response":"accountNumber already exists"});
        }
        else
        {
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
                  //console.log(results);
                  return res.status(200).send({"message":"ok","responseCode":"200","response":"data saved sucessfully"})
                 }).catch(err => {res.status(200).send({message: err.message});});

        }

    }).catch(err => {res.status(200).send({message: err.message});});
}
