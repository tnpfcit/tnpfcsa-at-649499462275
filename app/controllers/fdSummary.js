const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,NoRecords} = require('../config/env');


exports.findAll = (req, res) => {
var accountNumber = req.body.accountNumber;
 logger.info(`
    ${new Date()} || 
    ${req.originalUrl} || 
    ${JSON.stringify(req.body)} || 
    ${req.ip} || 
    ${req.protocol} || 
    ${req.method}
  `);
    
if(accountNumber){
db.sequelize.query('select accountNumber AS "accountNumber",productDesc AS "productDesc", productId AS "productId", openDate AS "openDate", maturityDate AS "maturityDate", interestRatePercent AS "interestRatePercent", depositAccountType AS "depositAccountType", jointHolder1 AS "jointHolder1", jointHolder2 AS "jointHolder2",intpayFrequency AS "intpayFrequency", interestAmount AS "interestAmount", depositAmount AS "depositAmount", maturityAmount AS "maturityAmount", interestPaid AS "interestPaid",fdrRequired AS "fdrRequired", bankName AS "bankName", ifscCode AS "ifscCode", accountNo AS "accountNo", accountStatus AS "accountStatus",isDepositRenewable AS "isDepositRenewable",nomineeName AS "nomineeName",nomineeRelationship AS "nomineeRelationship",isNomineeMajor AS "isNomineeMajor",nomineeDob AS "nomineeDob",nomineeGuardianName AS "nomineeGuardianName",nomineeGuardianRelationship AS "nomineeGuardianRelationship",isDepositClosable AS "isDepositClosable",isLoanEligible AS "isLoanEligible", tenure AS "tenure", eFdrUrl AS "eFdrUrl", accountHolderName AS "accountHolderName",taxDocSubmitted AS "taxDocSubmitted",bankBranchName AS "bankBranchName", bankBranchAddress AS "bankBranchAddress",depositCustCategory AS "depositCustCategory",closureType AS "closureType",isRenewableReason AS "isRenewableReason", isClosableReason AS "isClosableReason", isLoanEligibleReason AS "isLoanEligibleReason" from API_fd_summary  WHERE accountNumber =:accountNumber',
{ replacements: {accountNumber: accountNumber }, type: sequelize.QueryTypes.SELECT }
).then(results =>{
  if(results.length>0)
  {
  return res.status(200).send({"message": "ok","responseCode":"200","response":results});
  }
  else
  {
    res.send({"responseCode":"404","message": "customer details not found "});
  }
}).catch(err => {res.status(500).send({message: err.message});});
}
else
{
  res.send({"responseCode":"401","message": "Invalid input parameters. Please check the key value pair in the request body."});
}
};