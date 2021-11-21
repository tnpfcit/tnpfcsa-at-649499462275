const db = require('../config/db.js');
const sequelize = require('sequelize');
const microtime = require('microtime');
const moment = require('moment');
var converter = require('number-to-words');
//var transPayment = db.paymentgateway;
var transferDetails = db.response;
var {BeneficiaryBank,IFSCCode,NameofBeneficiaryAccount,PaymentReference} = require('../config/hardCodeValues.js');

exports.neft = (req, res) => {

var { 
        productId, customerId, categoryId, period, 
        interestPayment, depositAmount, rateOfInterest, 
        maturityAmount,channelId
} = req.body;
  
    if( productId && customerId && categoryId && period && Number(depositAmount>0) && rateOfInterest && maturityAmount && channelId && ((productId=='202' && interestPayment==0) || (productId=='201' && interestPayment>0)))
        {
            console.log("hellooooooooooooooo");
			if (productId=='201'){
				var interestAmount = ((Number(depositAmount) * Number(rateOfInterest)/1200)) * Number(period);
				var maturityAmt = Math.floor(Number(depositAmount)) + interestAmount;
			}
			else if (productId=='202'){
				var tenure = Number(period) / 12;
				var maturityAmt = Number(depositAmount) * Math.pow(1 + (Number(rateOfInterest) / (12 * 100)), 12 *  tenure);
				maturityAmt = Math.floor(Number(maturityAmt));
				console.log("amount======="+maturityAmt);
			}
			    if (maturityAmt == Number(maturityAmount)){
                    var convertedAmount = converter.toWords(depositAmount);
                    console.log("converted amount ========="+convertedAmount);
                    var transactionId = String(microtime.now());
                    var resultTransactionId = "TNPFCL"+ transactionId;
                    var dt = new Date();
                    var currentDate = `${
                                           dt.getFullYear().toString().padStart(4, '0')}/${
                                           (dt.getMonth()+1).toString().padStart(2, '0')}/${
                                            dt.getDate().toString().padStart(2, '0')} ${
                                            dt.getHours().toString().padStart(2, '0')}:${
                                            dt.getMinutes().toString().padStart(2, '0')}:${
                                            dt.getSeconds().toString().padStart(2, '0')}`; 

                    
		
		            transferDetails.build({
                        TRANSACTION_ID:resultTransactionId, 
                        PRODUCT_ID: productId, 
                        CUSTOMER_ID: customerId, 
                        PERIOD: period, 
                        INT_PAY_FREQUENCY: interestPayment, 
                        CATEGORY_ID: categoryId, 
                        RATE_OF_INT: rateOfInterest, 
                        MATURITY_AMOUNT: maturityAmount,
                        CHANNEL:channelId, 
                       // UTR_NUMBER:transactionId, 
                        DEPOSIT_AMT:depositAmount, 
                        CREATED_DT:currentDate
	                    }).save().then(anotherTask => {
                            console.log("insereted sucessfully");
                    }).catch(err => {res.status(500).send({message: err.message});})
										
                    return res.status(200).send({"Beneficiary Account Number":resultTransactionId,"Amount to be remitted":depositAmount,
                                      "Amount in Words ":convertedAmount, "Beneficiary Bank":BeneficiaryBank,
                                    "IFSC Code":IFSCCode, "Name of Beneficiary Account":NameofBeneficiaryAccount, "Payment Reference / Narration":PaymentReference});
                }
		
		        else{
                    return res.send({"responseCode":"402","message": "Invalid inputs found. Please retry"});
		        }
    }		
	else{
        return res.send({"responseCode":"401","message": "Invalid input parameters. Please check the key value pair in the request body."});
    }
}
 
 
 
 

  
 
  
  