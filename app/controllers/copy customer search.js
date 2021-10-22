const db = require('../config/db.js');
const sequelize = require('sequelize');
var moment = require('moment');
var response = require('../config/config.json');

exports.searchInformation = (req, res) => {
var {query,roleId} = req.body;
roleId = roleId ? roleId : null;    
  if(query){
      console.log("hello");
        db.sequelize.query('select accountNumber AS "accountNumber",custName AS "custName",customerId AS "customerId",panNumber AS "panNumber",productDesc AS "productDesc", productId AS "productId", openDate AS "openDate",\
        maturityDate AS "maturityDate", interestRatePercent AS "interestRatePercent", depositAccountType AS "depositAccountType", jointHolder1 AS "jointHolder1",\
        jointHolder2 AS "jointHolder2",intpayFrequency AS "intpayFrequency", interestAmount AS "interestAmount", depositAmount AS "depositAmount", maturityAmount AS "maturityAmount",\
        interestPaid AS "interestPaid",fdrRequired AS "fdrRequired", bankName AS "bankName", ifscCode AS "ifscCode", accountNo AS "accountNo", accountStatus AS "accountStatus",\
        isDepositRenewable AS "isDepositRenewable",nomineeName AS "nomineeName",nomineeRelationship AS "nomineeRelationship",isNomineeMajor AS "isNomineeMajor",nomineeDob AS "nomineeDob",\
        nomineeGuardianName AS "nomineeGuardianName",nomineeGuardianRelationship AS "nomineeGuardianRelationship",isDepositClosable AS "isDepositClosable",isLoanEligible AS "isLoanEligible",\
        tenure AS "tenure", eFdrUrl AS "eFdrUrl",loanAmount AS "loanAmount",lastIntPaidDt AS "lastIntPaidDt",lastIntPaidAmt AS "lastIntPaidAmt" from api_ipad_fd_summary  WHERE PANNUMBER=:query',
            {replacements: {query: query}, type: sequelize.QueryTypes.SELECT}
        ).then(results =>{ 
            if(results.length > 0){
                 return res.status(200).send({"responseCode":200,"response":results});
        } else {
            db.sequelize.query('select accountNumber AS "accountNumber",custName AS "custName",customerId AS "customerId",panNumber AS "panNumber",productDesc AS "productDesc", productId AS "productId", openDate AS "openDate",\
            maturityDate AS "maturityDate", interestRatePercent AS "interestRatePercent", depositAccountType AS "depositAccountType", jointHolder1 AS "jointHolder1",\
            jointHolder2 AS "jointHolder2",intpayFrequency AS "intpayFrequency", interestAmount AS "interestAmount", depositAmount AS "depositAmount", maturityAmount AS "maturityAmount",\
            interestPaid AS "interestPaid",fdrRequired AS "fdrRequired", bankName AS "bankName", ifscCode AS "ifscCode", accountNo AS "accountNo", accountStatus AS "accountStatus",\
            isDepositRenewable AS "isDepositRenewable",nomineeName AS "nomineeName",nomineeRelationship AS "nomineeRelationship",isNomineeMajor AS "isNomineeMajor",nomineeDob AS "nomineeDob",\
            nomineeGuardianName AS "nomineeGuardianName",nomineeGuardianRelationship AS "nomineeGuardianRelationship",isDepositClosable AS "isDepositClosable",isLoanEligible AS "isLoanEligible",\
            tenure AS "tenure", eFdrUrl AS "eFdrUrl",loanAmount AS "loanAmount",lastIntPaidDt AS "lastIntPaidDt",lastIntPaidAmt AS "lastIntPaidAmt" from api_ipad_fd_summary where CUSTOMERID=:query',
                {replacements: {query: query}, type: sequelize.QueryTypes.SELECT}
            ).then(results =>{ 
                if(results.length > 0){
                    return res.status(200).send({"responseCode":200,"response":results});
                } else {
                    db.sequelize.query('select accountNumber AS "accountNumber",custName AS "custName",customerId AS "customerId",panNumber AS "panNumber",productDesc AS "productDesc", productId AS "productId", openDate AS "openDate",\
                    maturityDate AS "maturityDate", interestRatePercent AS "interestRatePercent", depositAccountType AS "depositAccountType", jointHolder1 AS "jointHolder1",\
                    jointHolder2 AS "jointHolder2",intpayFrequency AS "intpayFrequency", interestAmount AS "interestAmount", depositAmount AS "depositAmount", maturityAmount AS "maturityAmount",\
                    interestPaid AS "interestPaid",fdrRequired AS "fdrRequired", bankName AS "bankName", ifscCode AS "ifscCode", accountNo AS "accountNo", accountStatus AS "accountStatus",\
                    isDepositRenewable AS "isDepositRenewable",nomineeName AS "nomineeName",nomineeRelationship AS "nomineeRelationship",isNomineeMajor AS "isNomineeMajor",nomineeDob AS "nomineeDob",\
                    nomineeGuardianName AS "nomineeGuardianName",nomineeGuardianRelationship AS "nomineeGuardianRelationship",isDepositClosable AS "isDepositClosable",isLoanEligible AS "isLoanEligible",\
                    tenure AS "tenure", eFdrUrl AS "eFdrUrl",loanAmount AS "loanAmount",lastIntPaidDt AS "lastIntPaidDt",lastIntPaidAmt AS "lastIntPaidAmt" from api_ipad_fd_summary  where ACCOUNTNUMBER=:query',
                        {replacements: {query: query}, type: sequelize.QueryTypes.SELECT}
                    ).then(results =>{ 
                        if(results.length > 0){
                                return res.status(200).send({"responseCode":200,"response":results});
                        } else {
                            return res.status(404).send({"response":[]});
                        }
                    }).catch(err => {res.status(500).send({message: err.message});});
                }
            }).catch(err => {res.status(500).send({message: err.message});});
        }
    }).catch(err => {res.status(500).send({message: err.message});});
}
}                  