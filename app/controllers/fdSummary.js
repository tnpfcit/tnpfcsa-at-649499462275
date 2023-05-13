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
	let query = 'select accountNumber AS "accountNumber",productDesc AS "productDesc", productId AS "productId", to_char(openDate,\'dd-mm-yyyy\') "openDate", \
	to_char(maturityDate,\'dd-mm-yyyy\') "maturityDate", interestRatePercent AS "interestRatePercent", depositAccountType AS "depositAccountType", \
	jointHolder1 AS "jointHolder1", jointHolder2 AS "jointHolder2",intpayFrequency AS "intpayFrequency", interestAmount AS "interestAmount", \
	depositAmount AS "depositAmount", maturityAmount AS "maturityAmount", interestPaid AS "interestPaid",fdrRequired AS "fdrRequired", bankName AS "bankName",\
	ifscCode AS "ifscCode", accountNo AS "accountNo", accountStatus AS "accountStatus",isDepositRenewable AS "isDepositRenewable",nomineeName AS "nomineeName",\
	nomineeRelationship AS "nomineeRelationship",isNomineeMajor AS "isNomineeMajor",to_char(nomineeDob,\'dd-mm-yyyy\') "nomineeDob",nomineeGuardianName AS "nomineeGuardianName",\
	nomineeGuardianRelationship AS "nomineeGuardianRelationship",isDepositClosable AS "isDepositClosable",isLoanEligible AS "isLoanEligible", tenure AS "tenure", eFdrUrl AS "eFdrUrl",\
	accountHolderName AS "accountHolderName",taxDocSubmitted AS "taxDocSubmitted",bankBranchName AS "bankBranchName", bankBranchAddress AS "bankBranchAddress",\
	depositCustCategory AS "depositCustCategory",closureType AS "closureType",isRenewableReason AS "isRenewableReason", isClosableReason AS "isClosableReason", \
	isLoanEligibleReason AS "isLoanEligibleReason",isNomineeChangeAllowed as "isNomineeChangeAllowed",\
	nomineeChangeMsg as "nomineeChangeMsg",to_char(LASTINTAPPLDT,\'dd-mm-yyyy\') AS "lastIntApplDt",LOANNO as\
	"loanNo",to_char(LOANLASTINTCALCDT,\'dd-mm-yyyy\') as "loanLastIntCalcDt", DEATHMARKED as "deathMarkedStatus",loanamount "loanAmount" from\
	API_fd_summary  WHERE accountNumber =:accountNumber';
	db.sequelize.query(query,
	{replacements:{accountNumber:accountNumber},type: sequelize.QueryTypes.SELECT}
	).then(results =>{
	  if(results.length>0){
		return res.status(200).send({
		  "responseCode":sucessCode,
		  "response":results
		});
	  }else{
		return res.status(200).send({
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