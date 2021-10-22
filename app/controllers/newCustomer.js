const db = require('../config/db.js');
const sequelize = require('sequelize');
const crypto = require("crypto");
var transPayment = db.paymentgateway;
var transferDetails = db.transDetails; 
var microtime = require('microtime');

exports.creation = (req, res) => {

var { productId, categoryId, period, interestPayment, depositAmount, rateOfInterest, maturityAmount,fName,lName,panNumber,aadhaarNumber,phoneNumber,dob} = req.body;

console.log("date==============================="+ dob);
	
if( fName && lName && panNumber && aadhaarNumber && phoneNumber && dob && productId && categoryId && period && interestPayment && depositAmount && rateOfInterest && maturityAmount)
        {

			db.sequelize.query('select API_CUSTOMER_CREATION (:fName, :lName, :panNumber, :aadhaarNumber, :phoneNumber, :dob ) AS "customerId" from dual',
			{ replacements: {fName: fName, lName: lName, panNumber: panNumber, aadhaarNumber: aadhaarNumber, phoneNumber: phoneNumber, dob:dob}, type: sequelize.QueryTypes.SELECT }).then(results =>{
			
				console.log(results);
				
				var customerid = results[0].customerId;
				console.log("generated customer id is=================="+ customerid);
				if(results.length > 0)
				{
					var Amount = String(depositAmount); 
					var transactionId = String(microtime.now());
					console.log("generated transaction id is ================"+ transactionId);
					var dt = new Date();
					var currentDate = `${
										   dt.getFullYear().toString().padStart(4, '0')}-${
										   (dt.getMonth()+1).toString().padStart(2, '0')}-${
											dt.getDate().toString().padStart(2, '0')} ${
											dt.getHours().toString().padStart(2, '0')}:${
											dt.getMinutes().toString().padStart(2, '0')}:${
											dt.getSeconds().toString().padStart(2, '0')}`;
				 
						console.log("date in specific format result====="+currentDate);
						   
						   
						   var reqData =   {
							"dateTime":currentDate,
							"amount":Amount,
							"isMultiSettlement":"0",
							"custMobile":"9901054678",
							"apiKey":"QENSEGY3FOF7FTRLQENSEGY3FOF7FTRL",
							"productId":"DEFAULT",
							"instrumentId":"NA",
							"udf5":"NA",
							"cardType":"NA",
							"txnType":"DIRECT",
							"udf3":"NA",
							"udf4":"NA",
							"udf1":"NA",
							"type":"1.0",
							"udf2":"NA",
							"merchantId":"M0000346",
							"cardDetails":"NA",
							"custMail":"test@test.com",
							"returnURL":"http:\/\/13.233.57.109:3001\/tnpfc\/v1\/processPGResponse",
							"channelId":"0",
							"txnId":transactionId,
							"newCustomer":"true"
						};
		
						 //var sds = "E82jyvDwPbBm01XutiGeaG+C05oSq3ubkKul7SSj7cuqlfYA6c+qdocWeNOo0/AshRoQQLtUaAFkDxam788Qa0JUr3EzZRS4doYxiBIKgNDpK/GwY4eWJSPDIN5QeAZQtxdr6wgdDprkEO4YnVeT0KVv1lR8ywUg8zylgeNh4Tr5maqN2QwVAQ//uAG5icWkgw1xwgXiuDX9lFvFoqazhNpuT8jAV1Mp2uuu1faTc0D8Z8ByycV3Tja1XDpSMFKR69uHWfACpz1WCjb3nCJmDRk+L+na0In08viliaJrkPTyjCR+jH3HYxnfxOWwR4hgQ24lXhtCSn2gILiCbkpBGbSm5CusGkvq0fHtZ73ovxAXVIIvn31r9aISy4d1vuhdqWOfpJRgDZxT5szoLFpx2inTUGZhCm6jmRJkp9yVbdYmqbOJwxRuGCqgs9DSSmb0zAZV+nDcENdJAGAsoEVwZ3Nw8nYSyWMNasyBeupPMhRFLd+SmAD8nTdBwP7R73s5ypHGtpmQmm+0vLaSgiPduJIE2aHiKzUDB2kqvosQsH4tZA9UmyLIBobka+XRNlSj6ScDzTD85Faed5IeywgYQTAz5ycDkyECTUsAkAavT60VyDQIZPh3VNRHUDkkYE73"
		
						
				var key = "QENSEGY3FOF7FTRLQENSEGY3FOF7FTRL";					
				const iv = "QENSEGY3FOF7FTRL";	
				var encrypt = crypto.createCipheriv('aes-256-cbc', key, iv);
				console.log("sample data======="+JSON.stringify(reqData));
				var theCipher = encrypt.update(JSON.stringify(reqData), 'utf8', 'base64');
				theCipher += encrypt.final('base64');
				
				
				console.log("encryption sample ----"+theCipher);	
		
				let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
				let decrypted = decipher.update(theCipher, 'base64', 'utf8');
				decrypted  += decipher.final('utf8');
				console.log("decryption data from payment gateway======"+decrypted); 
				
				transPayment.build({ TRANSACTION_ID: transactionId, CHANNEL: "INTERNET",PROD_ID:"NETBANK",UTR_NUMBER: transactionId, AMOUNT:depositAmount
				}).save().then(anotherTask => {console.log("insereted sucessfully");});
				
				transferDetails.build({ TRANSACTION_ID: transactionId, PROD_ID: productId, CUST_ID: customerid, PERIOD: period, INTEREST_PAY_FREQUENCY: interestPayment, CUST_CATEGORY: categoryId, INT_RATE: rateOfInterest, MATURITY_AMOUNT: maturityAmount
				}).save().then(anotherTask => {console.log("insereted sucessfully");});
												
				return res.status(200).send({"merchantId":"M0000346","transactionId":transactionId,"customerId":customerid,"reqData":theCipher});
			
				}
				else{
					return res.status(200).send({"response":"problem in creating customer"});
				}
			}).catch(err => {res.status(500).send({ message: err.message});
			});
			
		}
                
	else
	    {
            return res.send({"responseCode":"401","message": "Invalid input parameters. Please check the key value pair in the request body."});
        }
}
 
 
 
 

  
 
  
  