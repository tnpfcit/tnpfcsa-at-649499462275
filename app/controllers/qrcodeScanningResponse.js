const db = require('../config/db.js');
const sequelize = require('sequelize');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('TNPFC_QR_CODE_IRAH');
const crypto = require("crypto");
//var summary = require('./depositSummary');

exports.qrresponseInformation = (req,res) => {
	var encDepositNumber = req.query.fdId;
    var uuid = req.query.uuid;
	console.log(encDepositNumber);
	console.log(uuid);
	//encDepositNumber = encDepositNumber ? encDepositNumber : 'HwL59iq0YVdmCbPkWujQkA==';
    //encDepositNumber = 'HwL59iq0YVdmCbPkWujQkA==';
        if(encDepositNumber && uuid ){
            //var decuuid ='58cf71bf9b6d2b5c1bce212e514442bcfe636e748f4e3b03d97328ac7b8515816061fa38fad76fbd110a0cb44322485486bf99276c095332421e23f06fbabff69811d691c3caa48a0ff3149f52a4f294f671e9051c2f308ce0a8b772cb6112f2e3ed7f4646496e06a6cb20882b';
            const dt1 = cryptr.decrypt(uuid);
            var dt2 = new Date().getTime();
			var diff =(dt2 - dt1) / 60000;
            var result = Math.abs(Math.round(diff));
            //console.log(diff_minutes(dt1, dt2));
                if(result > 10){
                        return res.status(200).send({"responseCode":200,"message":"Url Link Expired"});
                    } else {
                        var key = "QENSEGY3FOF7FTRLQENSEGY3FOF7FTRL";					
                        var iv = "QENSEGY3FOF7FTRL";
                        //var qw = '+F103xCgiuA3zjV22ljdrdf0GeWNNQU77DP2tG90Zn+Vchuq7Peb//FAmXSVzrrV';
                        let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
                        let decrypted = decipher.update(encDepositNumber, 'base64');
                        decrypted  += decipher.final('utf8');
                        var accountNumber = decrypted;
						console.log(accountNumber);
						//let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
						//let decrypted = decipher.update('xO6Iww5NfbwUF589ZHF+ew==', 'base64');
						//decrypted  += decipher.final('utf8');
						//console.log(decrypted);
                         db.sequelize.query('select accountNumber AS "accountNumber",productDesc AS "productDesc", customerName AS "customerName",customerId AS "customerId",\
								depositcustCategory AS "custCategory",openDate AS "openDate",depositAmount AS "depositAmount",tenure AS "tenure",interestRatePercent AS "interestRatePercent",intpayFrequency AS "intpayFrequency",\
								maturityAmount AS "maturityAmount",interestAmount AS "interestAmount",periodicIntAmount AS "periodicIntAmount",maturityDate AS "maturityDate",nomineeName AS "nomineeName",\
								depositAccountType AS "depositAccountType",jointHolder1 AS "jointHolder1",jointHolder2 AS "jointHolder2" from API_fd_summary  WHERE accountNumber =:accountNumber',
								{replacements: {accountNumber: accountNumber}, type: sequelize.QueryTypes.SELECT}
						).then(results =>{
                        if(results.length > 0){ 
                          return res.status(200).send({"responseCode":200,"response":results});
                        } else {
                          return res.status(404).send({"responseCode":404, "response":"Deposit summary details not found"});
                        }
                      }).catch(err => {res.status(500).send({message: err.message});});
                    }
        }  else {
            return res.status(400).send({"responseCode":400,"response":"Bad request"});
        }
}  