const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,NoRecords,badRequestcode} = require('../config/env');

exports.depositSummary = (req, res) => {
	let accountNumber = req.body.accountNumber;
	logger.info(`
		${new Date()} || 
		${req.originalUrl} || 
		${JSON.stringify(req.body)} || 
		${req.ip} || 
		${req.protocol} || 
		${req.method}
	`);
    
	if(accountNumber){
		var query = 'select accountNumber "accountNumber",productDesc "productDesc", productId "productId", openDate "openDate", maturityDate "maturityDate",\
		interestRatePercent "interestRatePercent", depositAccountType "depositAccountType", jointHolder1 "jointHolder1", jointHolder2 "jointHolder2",\
		intpayFrequency "intpayFrequency", interestAmount "interestAmount", depositAmount "depositAmount", maturityAmount "maturityAmount",interestPaid "interestPaid",\
		fdrRequired "fdrRequired", bankName "bankName", ifscCode "ifscCode", accountNo "accountNo", accountStatus "accountStatus",isDepositRenewable "isDepositRenewable",\
		nomineeName "nomineeName",nomineeRelationship "nomineeRelationship",isNomineeMajor "isNomineeMajor",nomineeDob "nomineeDob",nomineeGuardianName "nomineeGuardianName",\
		nomineeGuardianRelationship "nomineeGuardianRelationship",isDepositClosable "isDepositClosable",isLoanEligible "isLoanEligible", tenure "tenure", eFdrUrl "eFdrUrl",\
		accountHolderName "accountHolderName", taxDocSubmitted "taxDocSubmitted",bankBranchName "bankBranchName", bankBranchAddress "bankBranchAddress",depositCustCategory "depositCustCategory",closureType "closureType",isRenewableReason "isRenewableReason", isClosableReason "isClosableReason", isLoanEligibleReason "isLoanEligibleReason" from API_fd_summary  WHERE accountNumber =:accountNumber';
	
		db.sequelize.query(query,{replacements:{accountNumber:accountNumber},type: sequelize.QueryTypes.SELECT}
		).then(results =>{
			if(results.length>0){
				return res.status(200).send({
				"responseCode":sucessCode,
				"response":results
				});
			}else{
				return res.status(404).send({
				"responseCode":resourceNotFoundcode,
				"response":NoRecords
				});
			}
		}).catch(err => {
			return res.status(500).send({
			data:null,
			message: err.message
			});
		});
	} else {
		return res.status(400).send({
		"responseCode":badRequestcode,
		"response":responseMessage
		});
	}
}