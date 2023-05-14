const db = require('../config/db.js');
const sequelize = require('sequelize');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('TNPFC_QR_CODE_IRAH');
var urlencode = require('urlencode');
var logger = require('../config/logger');
var {
    responseMessage,
    sucessCode,
    resourceNotFoundcode,
    badRequestcode,
    qrUrl
} = require('../config/env');

exports.qrInformation = (req,res) => {
    var encDepositNumber = req.body.encDepositNumber;
    encDepositNumber = urlencode(encDepositNumber);
    //encDepositNumber = encDepositNumber ? encDepositNumber : 'HwL59iq0YVdmCbPkWujQkA==';

    logger.info(`
        ${res.StatusCode} || 
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);

    if(encDepositNumber){
        
        var uuid = new Date().getTime();
        const encryptedString = cryptr.encrypt(uuid);
        var qrcodeUrl = qrUrl + encDepositNumber +'&uuid='+ encryptedString;
        // var qrcodeUrl = "https://test-node-api.tnpowerfinance.com/tnpfc/v1/getQRData?fdId="+ encDepositNumber +'&uuid='+ encryptedString;
        //var qrcodeUrl = "https://portal-api.tnpowerfinance.com/tnpfc/v1/getQRData?fdId="+ encDepositNumber +'&uuid='+ encryptedString;
        
        return res.status(200).send({
            "responseCode":sucessCode,
            "response":qrcodeUrl
        });

    } else {
        return res.status(400).send({
            "responseCode":resourceNotFoundcode,
            "response":responseMessage
        });
    }
} 