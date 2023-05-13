const db = require('../config/db.js');
const sequelize = require('sequelize');
var converter = require('number-to-words');
const logger = require('../config/logger');
var moment = require('moment');
var document = db.response;
const pdfPaySlip = require('../helpers/pdfPaySlip');
var urlencode = require('urlencode');
const MaskData = require('maskdata');
var request = require('request');
var word = require('../helpers/convert2words');
var {username,hash,sender} = require('../config/env.js');
var { BeneficiaryBank, IFSCCode, NameofBeneficiaryAccount, PaymentReference } = require('../config/env.js');



exports.paySucess = (req, res) => {
    var {transactionId,paymentType} = req.body;
	logger.info(`${new Date()} || ${req.originalUrl} || ${JSON.stringify(req.body)} || ${req.ip} || ${req.protocol}`);
    if (transactionId && paymentType == 'RTGS') {
        db.sequelize.query('select decode (c.cust_type,\'INDIVIDUAL\',c.fname,c.comp_name) as "depositorName",cp.PHONE_NUMBER as "phoneNumber",FE_PAY_TYPE as "paymentType", PRODUCT_ID as "productId",CUSTOMER_ID as "customerId",PERIOD as "period",\
            INT_PAY_FREQUENCY as "interestPayment", CATEGORY_ID as "categoryId",RATE_OF_INT as "rateOfInterest", DEPOSIT_AMT as "depositAmount",\
			MATURITY_AMOUNT as "maturityAmount" from PG_RTGS_NEFT_TRANS_DETAILS PR left join customer c on PR.customer_id = c.cust_id join cust_phone cp on PR.customer_id = cp.cust_id where TRANSACTION_ID = :transactionId',
            { replacements: { transactionId: transactionId }, type: sequelize.QueryTypes.SELECT }
        ).then(results => {
			logger.info(JSON.stringify(results));
            if (results.length > 0) {
                var paymentType = results[0].paymentType;
                var productId = results[0].productId;
                if (productId == '201') {
                    productId = 'Non-Cumulative';
                } else if (productId == '202') {
                    productId = 'Cumulative';
                }
                var firstName = results[0].depositorName.length>16? results[0].depositorName.substring(0,16):results[0].depositorName;
                var depositorName = results[0].depositorName; 
                var maturityAmount = results[0].maturityAmount;
                var depositAmount = results[0].depositAmount;
                var period = results[0].period;
                var interestPayment = results[0].interestPayment;
                if (interestPayment == 0) {
                    interestPayment = 'onMaturity';

                } else if (interestPayment == 30) {
                    interestPayment = 'Monthly';

                } else if (interestPayment == 90) {
                    interestPayment = 'Quaterly';
                } else if (interestPayment == 360) {
                    interestPayment = 'Annually';
                }
                var rateOfInterest = results[0].rateOfInterest;
                var phoneNumber = results[0].phoneNumber;
                var amountWords = converter.toWords(depositAmount).replace(/[^a-zA-Z0-9]/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                //var amount2Words = amountWords + ' ' + "Rupees" + ' ' + "Only";
                //var amount2Words = amountWords + ' ' + "Rupees Only";
				var amount2Words = word.convertNumberToWords(depositAmount) + ' ' + "Rupees Only";
                var date = moment(new Date()).format(' DD MMM YYYY ');
                // Creating data object for PDF 
                var pdfData = {
                    depositorName: results[0].depositorName,
                    depositAmount: depositAmount,
                    schemeType: productId,
                    duration: period,
                    interestRate: rateOfInterest,
                    interestfrequency: interestPayment,
                    maturityAmount: maturityAmount,
                    beneficiaryAccountNumber: transactionId,
                    amountToBeRemitted: depositAmount,
                    amountinWords: amount2Words,
                    beneficiaryBank: BeneficiaryBank,
                    ifscCode: IFSCCode,
                    nameofBeneficiaryAccount: NameofBeneficiaryAccount,
                    paymentReference: PaymentReference,
                    customerId: transactionId
                }
                console.log(pdfData);
                pdfPaySlip.generatePaySlipPdf(pdfData, function (uploadedDocUrl,uploadedDocLink,file) {
                    //console.log(uploadedDocUrl);
                    document.update({ PAYMENT_ADVICE_URL:uploadedDocUrl},{where: {TRANSACTION_ID:transactionId}}
                    ).then(results =>{
                        var msg = urlencode('Dear '+firstName+', You have generated RTGS/NEFT payment advice for new fixed deposit request with transaction ID '+transactionId+'. TNPFCL will issue Fixed Deposit confirmation receipt on realisation of payment as per payment advice generated. -Tamil Nadu Power Finance (TNPF)');
                        //var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
						var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+phoneNumber+'&text='+msg+'&route=6';
                        //request("https://api.textlocal.in/send?"+ data, (error, response, body) => {});
						request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {});
                        return res.status(200).send({
                            "responseCode": 200,
                            "paymentType": paymentType, "scheme": productId, "period": period, "interestRate": rateOfInterest, "frequency": interestPayment,
                            "beneficiaryAccountNumber": transactionId, "amountToBeRemitted": depositAmount,
                            "amountinWords": amount2Words, "beneficiaryBank": BeneficiaryBank,
                            "ifscCode": IFSCCode, "nameofBeneficiaryAccount": NameofBeneficiaryAccount,
                            "paymentReference": PaymentReference, "date": date,
                            "maturityAmount": maturityAmount, "depositorName": depositorName, "paymentAdviceUrl": uploadedDocUrl
                         });
                    }).catch(err => { 
					logger.error("payment advice uploading error"+err);
					res.status(500).send({ message: err.message }) });
                })// check here if anything goes wrong it is newly added you can remove
            } else {
                return res.status(404).send({ "responseCode": 404, "response": "Transaction details not found" });
            }
        }).catch(err => { 
		  logger.error(err);
		res.status(500).send({ message: err.message }) });
    } else if (transactionId && paymentType == 'NETBANKING') {
        db.sequelize.query('select decode (c.cust_type,\'INDIVIDUAL\',c.fname,c.comp_name) as "depositorName", ACCT_NUM as "depositNumber", cp.PHONE_NUMBER as "phoneNumber", FE_PAY_TYPE as "paymentType", PRODUCT_ID as "productId",CUSTOMER_ID as "customerId",PERIOD as "period",\
	        INT_PAY_FREQUENCY as "interestPayment",DEPOSIT_AMT as "depositAmount", CATEGORY_ID as "categoryId",RATE_OF_INT as "rateOfInterest" from PG_RTGS_NEFT_TRANS_DETAILS PR join customer c on PR.customer_id = c.cust_id join cust_phone cp on PR.customer_id = cp.cust_id where TRANSACTION_ID = :transactionId',
            { replacements: { transactionId: transactionId }, type: sequelize.QueryTypes.SELECT }
        ).then(results => {
			logger.info(JSON.stringify(results));
            if (results.length > 0) {
                var depositAmount = results[0].depositAmount;
                var depositNumber = results[0].depositNumber;
                var firstName = results[0].depositorName.length>16? results[0].depositorName.substring(0,16):results[0].depositorName;
                var paymentType = results[0].paymentType;
                var productId = results[0].productId;
                var customerId = results[0].customerId;
                var categoryId = results[0].categoryId;
                var period = results[0].period;
                var interestPayment = results[0].interestPayment;
                var rateOfInterest = results[0].rateOfInterest;
                var phoneNumber = results[0].phoneNumber;
                db.sequelize.query('select * from  API_fd_summary where accountnumber =:depositNumber',
                    { replacements: { depositNumber: depositNumber }, type: sequelize.QueryTypes.SELECT }
                ).then(results => {
					logger.info(JSON.stringify(results));
					if(results.length > 0){
						var msg = urlencode('Dear '+firstName+',Received payment of Rs. '+depositAmount+' towards new FD creation with transaction ID '+transactionId+'.-TNPFIDC');
						//var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + phoneNumber + '&message=' + msg;
						var data = 'APIKey=6IBUmYiLRk659H5Blt03RQ&senderid=TNPFFD&channel=Trans&DCS=0&flashsms=0&number='+phoneNumber+'&text='+msg+'&route=6';
						//request("https://api.textlocal.in/send?"+ data, (error, response, body) => {});
						request.get("http://182.18.143.11/api/mt/SendSMS?"+ data, (error, response, body) => {});
						return res.status(200).send({
                        "responseCode": 200, "paymentType": paymentType, "productId": productId, "customerId": customerId, "period": period,
                        "categoryId": categoryId, "interestPayment": interestPayment, "rateOfInterest": rateOfInterest, "depositNumber": depositNumber, "response": results
						});
					} else {
						 return res.status(404).send({ "responseCode": 404, "response": "Account details not found" });
					}	
                }).catch(err => { 
				logger.error("summary details failed===="+err);
				res.status(500).send({ message: err.message }) });
            } else {
                return res.status(404).send({ "responseCode": 404, "response": "Account details not found" });
            }
        }).catch(err => { 
		logger.error("select query failed========="+err);
		res.status(500).send({ message: err.message }) });
    } else {
        return res.status(400).send({ "responseCode": 400, "response": "Bad Request"});
    }
} 