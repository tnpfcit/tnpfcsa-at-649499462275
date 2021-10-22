const db = require('../config/db.js');
const sequelize = require('sequelize');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('TNPFC_QR_CODE_IRAH');
var urlencode = require('urlencode');

exports.qrInformation = (req,res) => {
    var encDepositNumber = req.body.encDepositNumber;
	encDepositNumber = urlencode(encDepositNumber);
    //encDepositNumber = encDepositNumber ? encDepositNumber : 'HwL59iq0YVdmCbPkWujQkA==';
	
    if(encDepositNumber){
        var uuid = new Date().getTime();
        const encryptedString = cryptr.encrypt(uuid);
        //const decryptedString = cryptr.decrypt(encryptedString);
       // var qrcodeUrl = "https://test-node-api.tnpowerfinance.com/tnpfc/v1/getQRData?fdId="+ encDepositNumber +'&uuid='+ encryptedString;
		var qrcodeUrl = "https://portal-api.tnpowerfinance.com/tnpfc/v1/getQRData?fdId="+ encDepositNumber +'&uuid='+ encryptedString;
        //console.log(qrcodeUrl);
        return res.status(200).send({"responseCode":200,"response":qrcodeUrl});
    }  else {
        return res.status(400).send({"responseCode":400,"response":"Bad request"});
    }

}  