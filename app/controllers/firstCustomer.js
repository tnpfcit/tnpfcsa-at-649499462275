const db = require('../config/db.js');
const sequelize = require('sequelize');
const converter = require('number-to-words');
const PG_RTGS_NEFT_TRANS_DETAILS = db.response;
const logger = require('../config/logger');
const Razorpay = require('razorpay');
const {
    BeneficiaryBank,
    IFSCCode,
    NameofBeneficiaryAccount,
    PaymentReference,
    newurl,
    key,
    iv,
    appkey,
    appiv,
    androidmerchantId,
    merchantId,
    hdfcprodReturnUrl,
    sucessCode,
    badRequestcode,
    responseMessage,
	iosmerchantId,
	iosappkey,
	iosappiv,
	CCAVE_WORKING_KEY, 
	CCAVE_MERCHANT_ID, 
	CCAVE_TEST_REDIRECT_URL,
	RAZORPAY_KEY_ID, 
	RAZORPAY_KEY_SECRET
} = require('../config/env.js');
const CCAvenue = require("../helpers/ccAvenue");
const { hdfcEncrypt, getCurrentDt, getChannelID, generateTransactionID  } = require('../helpers/utils');

const createNewCustomer = (params) => {
    console.log(params);
    return new Promise( (resolve, reject) =>{
        db.sequelize.query('select API_FIRST_CUSTOMER_CREATION(:title,:fName,:dob,:gender,:phoneNumber,:emailId,:aadhaarNumber,\
            :panNumber,:residentialStatus,:perAddress1,:perAddress2,:perState,\
            :perDistrict,:perCity,:perpinCode,:corAddress1,:corAddress2,:corState,\
            :corDistrict,:corCity,:corpinCode,:nomineeName,:nomineeDob,:nomineeRelationship,\
			:guardianName,:guardianRelationship,:verifiedPAN,:verifiedAADHAAR,:addressProofType,\
            :idProofUrl,:profilePicUrl,:addProofurl,:channelId,:categoryId,:depositType,:jointHolderName,\
            :bankAcctNumber,:bankName,:bankAcctHolderName,:bankIfscCode,:bankChequeUrl,:transId, :agentId, :jointHolder2Name, :perCountry,:corCountry) AS "customerId" from dual',
            {replacements: {
                title: params.title, 
                fName: params.fName, 
                dob: params.dob, 
                gender: params.gender, 
                phoneNumber: params.phoneNumber, 
                emailId: params.emailId,
                aadhaarNumber: params.aadhaarNumber, 
                panNumber: params.panNumber, 
                residentialStatus: params.residentialStatus, 
                perAddress1: params.perAddress1,
                perAddress2: params.perAddress2, 
                perState: params.perState, 
                perDistrict: params.perDistrict, 
                perCity: params.perCity, 
                perpinCode: params.perpinCode,
                corAddress1: params.corAddress1, 
                corAddress2: params.corAddress2, 
                corState: params.corState, 
                corDistrict: params.corDistrict, 
                corCity: params.corCity,
                corpinCode: params.corpinCode, 
                nomineeName: params.nomineeName, 
                nomineeDob: params.nomineeDob, 
                nomineeRelationship: params.nomineeRelationship,
			    guardianName: params.guardianName, 
                guardianRelationship: params.guardianRelationship, 
                verifiedPAN: params.verifiedPAN, 
                verifiedAADHAAR: params.verifiedAADHAAR, 
                addressProofType: params.addressProofType,
                idProofUrl: params.idProofUrl,
                profilePicUrl: params.profilePicUrl, 
                addProofurl: params.addProofurl, 
                channelId: params.channelId, 
                categoryId: params.categoryId, 
                depositType: params.depositType, 
                jointHolderName: params.jointHolderName,
                bankAcctNumber: params.bankAcctNumber, 
                bankName: params.bankName, 
                bankAcctHolderName: params.bankAcctHolderName, 
                bankIfscCode: params.bankIfscCode, 
                bankChequeUrl: params.bankChequeUrl, 
                transId: params.transId, 
                agentId: params.agentId, 
                jointHolder2Name: params.jointHolder2Name,
				perCountry:params.perCountry,
				corCountry:params.corCountry
            }, type: sequelize.QueryTypes.SELECT}
        ).then( results =>{
            resolve(results);
        }).catch( err =>{
			logger.error(err);
            reject( err );
        });
    });
}


const createNewTransDetails = (params) =>{
    return new Promise( (resolve, reject) =>{
        PG_RTGS_NEFT_TRANS_DETAILS.build({
            TRANSACTION_ID: params.transactionId,
            CHANNEL: params.channelId,
            FE_PAY_TYPE: params.paymentType,
            PRODUCT_ID: params.productId, 
            CUSTOMER_ID: params.customerid, 
            PERIOD: params.period, 
            INT_PAY_FREQUENCY: params.interestPayment, 
            CATEGORY_ID: params.categoryId, 
            RATE_OF_INT: params.rateOfInterest, 
            MATURITY_AMOUNT: params.maturityAmount, 
            DEPOSIT_AMT: params.depositAmount,
            CREATED_DT: params.currentDate,
			PG_REF_ID : params.pgRefId ? params.pgRefId : null
        }).save().then( results =>{
            resolve(results);
        }).catch( err =>{
			logger.error(err);
            reject(err);
        });
    });
}

exports.custCreation = (req, res) => {
    let agentId = 'SYS';
    let { 
		productId,
        categoryId, 
        period, 
        interestPayment, 
        depositAmount, 
        rateOfInterest, 
        maturityAmount,
        title,
        fName,
        dob,
        gender,
        phoneNumber,
        emailId,
        aadhaarNumber,
        panNumber,
        residentialStatus,
        perAddress1,
        perAddress2,
        perState,
        perDistrict,
        perCity,
        perpinCode,
        corAddress1,
        corAddress2,
        corState,
        corDistrict,
        corCity,
        corpinCode,
        nomineeName,
        nomineeDob,
        nomineeRelationship,
        guardianName,
        guardianRelationship,
        verifiedPAN,
        verifiedAADHAAR,
        addressProofType,
        idProofUrl,
        profilePicUrl,
        addProofurl,
        paymentType,
        reqChannel,
        depositType,
        jointHolderName,
        bankAcctNumber,
        bankName,
        bankAcctHolderName,
        bankIfscCode,
        bankChequeUrl,
		jointHolder2Name,
		perCountry,
		corCountry,
		paymentBank
    } = req.body;

    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol}
    `);
	
	if(depositAmount < 50000){
		return res.status(500).send({"responseCode":"500","response":"Deposit Amount Should not be less than Rs 50000"});
	}
	
	nomineeName = nomineeName ? nomineeName  : null;
	nomineeDob = nomineeDob  ? nomineeDob  : null;
	nomineeRelationship = nomineeRelationship ? nomineeRelationship : null;
    guardianName = guardianName ? guardianName : null;
    guardianRelationship = guardianRelationship ? guardianRelationship : null;
    jointHolderName = jointHolderName ? jointHolderName : null;
	jointHolder2Name = jointHolder2Name ? jointHolder2Name : null;
	bankChequeUrl=bankChequeUrl?bankChequeUrl:null;

    if (addProofurl instanceof Array) {
        addProofurl = addProofurl.map(element => element.url).toString();
        addProofurl = addProofurl.replace(/\,/g, "|");
    }

	let channelId = getChannelID(reqChannel);
	let reqMerchantId = (reqChannel == 'android') ? androidmerchantId : (reqChannel == 'ios') ?iosmerchantId :merchantId;
	let encryptkey = (reqChannel == 'android') ? appkey : (reqChannel == 'ios') ?iosappkey :key;
	let encryptiv = (reqChannel == 'android') ? appiv : (reqChannel == 'ios') ?iosappiv :iv;
	
    let transId = generateTransactionID(paymentType);
	
    if(title) {
        let currentDate = getCurrentDt();
		
		const params = { title: title, fName: fName, dob: dob, gender: gender, phoneNumber: phoneNumber, emailId: emailId,
            aadhaarNumber: aadhaarNumber, panNumber: panNumber, residentialStatus: residentialStatus, perAddress1: perAddress1,
            perAddress2: perAddress2, perState: perState, perDistrict: perDistrict, perCity: perCity, perpinCode: perpinCode,
            corAddress1: corAddress1, corAddress2: corAddress2, corState: corState, corDistrict: corDistrict, corCity: corCity,
            corpinCode: corpinCode, nomineeName: nomineeName, nomineeDob: nomineeDob, nomineeRelationship: nomineeRelationship,
			guardianName: guardianName,guardianRelationship: guardianRelationship,verifiedPAN: verifiedPAN,verifiedAADHAAR: verifiedAADHAAR,addressProofType: addressProofType,
            idProofUrl: idProofUrl,profilePicUrl: profilePicUrl, addProofurl: addProofurl, channelId: channelId, categoryId: categoryId, depositType: depositType, jointHolderName: jointHolderName,bankAcctNumber: bankAcctNumber, bankName: bankName, bankAcctHolderName: bankAcctHolderName, bankIfscCode: bankIfscCode, bankChequeUrl: bankChequeUrl, transId: transId, agentId: agentId, jointHolder2Name: jointHolder2Name,perCountry:perCountry,corCountry:corCountry
        };
       	
		createNewCustomer(params).then(results =>{
			
			if(results.length > 0 && paymentType == "NETBANKING" && transId) {
                let customerid = results[0].customerId;
                let Amount = String(depositAmount); 
                let transactionId = transId;
				let reqData, theCipher;
				let merchantID = (paymentBank == "BOB") ? CCAVE_MERCHANT_ID : reqMerchantId;
				
				if(paymentBank == "BOB"){
                    let ccAvenue = new CCAvenue({
                             merchant_id: CCAVE_MERCHANT_ID,
                             working_key: CCAVE_WORKING_KEY,
                        });
                    reqData = {
                        merchant_id : CCAVE_MERCHANT_ID,
                        order_id: transactionId,
                        currency : 'INR',
                        amount : Amount,
                        redirect_url : encodeURIComponent(CCAVE_TEST_REDIRECT_URL),
                        cancel_url: encodeURIComponent(""),
                        language: "EN",
                        customer_identifier : customerid,
                        merchant_param1 : true,
                        merchant_param2 : paymentType
                    };
                    theCipher = ccAvenue.getEncryptedRequest(reqData);
                }else if(paymentBank == "HDFC"){
				var reqData =  {
					"dateTime":currentDate,
					"amount":Amount,
					"isMultiSettlement":"0",
					"custMobile":"9113898212",
					"apiKey":encryptkey,
					"productId":"DEFAULT",
					"instrumentId":"NA",
					"udf5":"NA",
					"cardType":"NA",
					"txnType":"DIRECT",
					"udf3":"NA",
					"udf4":"NA",
					"udf1":"true",
					"type":"1.0",
					"udf2":paymentType,
					"merchantId":reqMerchantId,
					"cardDetails":"NA",
					"custMail":"test@test.com",
					"returnURL":hdfcprodReturnUrl,
					"channelId":"0",
					"txnId":transactionId,
					"newCustomer":"true"
				};	
				//reqData =   { ...reqData, "apiKey":appkey };
                theCipher = hdfcEncrypt(reqData, encryptkey, encryptiv);
				
                }
				
				if(reqData && theCipher){
					
					const transParams = {
                        transactionId: transactionId,
                        channelId: channelId, 
                        paymentType: paymentType, 
                        productId: productId, 
                        customerid: customerid, 
                        period: period, 
                        interestPayment: interestPayment, 
                        categoryId: categoryId, 
                        rateOfInterest: rateOfInterest, 
                        maturityAmount: maturityAmount,
                        depositAmount: depositAmount,
                        currentDate: currentDate
                    };
					
					 createNewTransDetails(transParams).then(results => {
						if(channelId=='app'){
							return res.status(200).send({
								"responseCode":sucessCode,
								"redirectUrl":newurl,
								"paymentType":paymentType,
								"merchantId":reqMerchantId,
								"transactionId":transactionId,
								"customerId":customerid,
								"reqData":theCipher
							});
						} else {
							return res.status(200).send({
								"responseCode":sucessCode,
								"redirectUrl":newurl,
								"paymentType":paymentType,
								"merchantId":reqMerchantId,
								"transactionId":transactionId,
								"customerId":customerid,
								"reqData":theCipher,
								"response":[{
									"redirectUrl":newurl,
									"paymentType":paymentType,
									"merchantId":reqMerchantId,
									"transactionId":transactionId,
									"customerId":customerid,
									"reqData":theCipher
								}]
							});
						}
                }).catch(err => {
                    logger.error(err);
                    return res.status(500).send({
                        data:null,
                        message: err.message
                    });
                });
			}else{
                    logger.error(`Encrypted data missing...`);
                    return res.status(500).send({"responseCode":500,"response":"Technical error. Please try again later"});
                }	
            
            } else if (results.length > 0 && paymentType == "RTGS" && transId) {
                let customerid = results[0].customerId;
                let resultTransactionId = transId;
                let amount2Words = converter.toWords(depositAmount).replace(/[^a-zA-Z0-9]/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                
				const rtgsParams = {
                    transactionId: resultTransactionId, 
                    productId: productId,
                    customerid: customerid,
                    paymentType: paymentType, 
                    period: period,
                    interestPayment: interestPayment, 
                    categoryId: categoryId, 
                    rateOfInterest: rateOfInterest, 
                    maturityAmount: maturityAmount, 
                    channelId: channelId, 
                    depositAmount: depositAmount, 
                    currentDate: currentDate
                };
				
                createNewTransDetails(rtgsParams).then(anotherTask => {
                        
                    return res.status(200).send({
                        "responseCode":sucessCode,
                        "paymentType":paymentType, 
                        "depositorName":fName,
                        "scheme":productId,
                        "period":period,
                        "interestRate":rateOfInterest,
                        "frequency":interestPayment,
                        "beneficiaryAccountNumber":resultTransactionId,
                        "amounttoberemitted":depositAmount,
                        "amountinWords":amount2Words, 
                        "beneficiaryBank":BeneficiaryBank,
                        "ifscCode":IFSCCode, 
                        "nameofBeneficiaryAccount":NameofBeneficiaryAccount, 
                        "paymentReference":PaymentReference,
                        "response":[{
                            "paymentType":paymentType, 
                            "depositorName":fName,
                            "scheme":productId,
                            "period":period,
                            "interestRate":rateOfInterest,
                            "frequency":interestPayment,
                            "beneficiaryAccountNumber":resultTransactionId,
                            "amounttoberemitted":depositAmount,
                            "amountinWords":amount2Words, 
                            "beneficiaryBank":BeneficiaryBank,
                            "ifscCode":IFSCCode, 
                            "nameofBeneficiaryAccount":NameofBeneficiaryAccount, 
                            "paymentReference":PaymentReference
                        }]
                    });    
                }).catch(err => {
                    return res.status(500).send({
                        data:null,
                        message: err.message
                    });
                });

            } else {
                
                return res.status(500).send({
                    "responseCode":500,
                    "response":"Problem in Creating Customer"
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


exports.custCreationViaRazorPay = (req, res)=>{
    let agentId = 'SYS';
    let { 
        
        productId, categoryId, period, interestPayment, depositAmount, 
        rateOfInterest, maturityAmount,title,fName,dob,gender,phoneNumber,
        emailId,aadhaarNumber,panNumber,residentialStatus,perAddress1,perAddress2,
        perState,perDistrict,perCity,perpinCode,corAddress1,corAddress2,corState,
        corDistrict,corCity,corpinCode,nomineeName,nomineeDob,nomineeRelationship,
        guardianName,guardianRelationship,verifiedPAN,verifiedAADHAAR,addressProofType,
        idProofUrl,profilePicUrl,addProofurl,paymentType,reqChannel,depositType,jointHolderName,bankAcctNumber,
        bankName,bankAcctHolderName,bankIfscCode,bankChequeUrl,jointHolder2Name,perCountry,corCountry,paymentBank
        
    } = req.body;


	    logger.info(
        `${new Date()} || 
         ${req.originalUrl} || 
         ${JSON.stringify(req.body)} || 
         ${req.ip} || 
         ${req.protocol}`
		);
		
		if(depositAmount < 50000){
			return res.status(500).send({"responseCode":"500","response":"Deposit Amount Should not be less than Rs 50000"});
		}

		nomineeName = nomineeName ? nomineeName  : null;
		nomineeDob = nomineeDob  ? nomineeDob  : null;
		nomineeRelationship = nomineeRelationship ? nomineeRelationship : null;
		guardianName = guardianName ? guardianName : null;
		guardianRelationship = guardianRelationship ? guardianRelationship : null;
		jointHolderName = jointHolderName ? jointHolderName : null;
		jointHolder2Name = jointHolder2Name ? jointHolder2Name : null;
		bankChequeUrl=bankChequeUrl?bankChequeUrl:null;
		
        if (addProofurl instanceof Array) {
            addProofurl = addProofurl.map(element => element.url).toString();
            addProofurl = addProofurl.replace(/\,/g, "|");
        }
        
        let channelId = getChannelID(reqChannel);
        let transId = generateTransactionID(paymentType);
        logger.info("transId=========="+ transId);

        if(title) {
            let currentDate = getCurrentDt();
            const params = { title: title, fName: fName, dob: dob, gender: gender, phoneNumber: phoneNumber, emailId: emailId,
                aadhaarNumber: aadhaarNumber, panNumber: panNumber, residentialStatus: residentialStatus, perAddress1: perAddress1,
                perAddress2: perAddress2, perState: perState, perDistrict: perDistrict, perCity: perCity, perpinCode: perpinCode,
                corAddress1: corAddress1, corAddress2: corAddress2, corState: corState, corDistrict: corDistrict, corCity: corCity,
                corpinCode: corpinCode, nomineeName: nomineeName, nomineeDob: nomineeDob, nomineeRelationship: nomineeRelationship,
                guardianName: guardianName,guardianRelationship: guardianRelationship,verifiedPAN: verifiedPAN,verifiedAADHAAR: verifiedAADHAAR,addressProofType: addressProofType,
                idProofUrl: idProofUrl,profilePicUrl: profilePicUrl, addProofurl: addProofurl, channelId: channelId, categoryId: categoryId, depositType: depositType, jointHolderName: jointHolderName,
                bankAcctNumber: bankAcctNumber, bankName: bankName, bankAcctHolderName: bankAcctHolderName, bankIfscCode: bankIfscCode, bankChequeUrl: bankChequeUrl, transId: transId, agentId: agentId, jointHolder2Name: jointHolder2Name,perCountry:perCountry,corCountry:corCountry
            };
            createNewCustomer(params).then(results =>{
				let customerid = results[0].customerId;
                let Amount = String(depositAmount); 
                if(results.length > 0 && paymentType == "NETBANKING" && transId && paymentBank == "ICICI") {
                    const instance = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
                    let options = {
                        amount: Number(depositAmount),
                        currency: "INR",
                        receipt: transId,
                        notes: {
                            merchant_param1 : true,
                            merchant_param2 : paymentType
                        }
                    };
                    instance.orders.create(options, function(error, order){
                        if(error){
                            return res.status(500).send({ responseCode: 500, response: error });
                        }
                        if(order && order.id != null && order.status == 'created'){
                            const transParams = {
                                transactionId: transId,
                                channelId: channelId, 
                                paymentType: paymentType, 
                                productId: productId, 
                                customerid: customerid, 
                                period: period, 
                                interestPayment: interestPayment, 
                                categoryId: categoryId, 
                                rateOfInterest: rateOfInterest, 
                                maturityAmount: maturityAmount,
                                depositAmount: depositAmount,
                                currentDate:currentDate,
                                pgRefId : String(order.id)
                            };

                            createNewTransDetails(transParams).then(results => {
    
                                if(reqChannel == 'app'){                        
                                   return res.status(200).send({
                                        responseCode: sucessCode,
                                        redirectUrl: newurl,
                                        paymentType: paymentType,
                                        transactionId: transId,
                                        customerId: customerid,
                                        reqData: order
                                    });
            
                                } else {
                                    return res.status(200).send({
                                        responseCode: sucessCode,
                                        redirectUrl: newurl, paymentType:paymentType,
                                        transactionId: transId, customerId: customerid, reqData: order,
                                        response:[{
                                            redirectUrl: newurl, paymentType: paymentType,
                                            transactionId: transId, customerId: customerid, reqData: order
                                        }]
                                    });
                                }
                            }).catch(err => {
                                logger.error(err);
                                return res.status(500).send({ message: err.message});
                            });
                        }
                    });
                }else{
                    return res.status(400).send({"responseCode":badRequestcode,"message": "Bad request check input parameters"});
                }
            }).catch(err => { return res.status(500).send({data:null, message: err.message}) });
        }else{
            return res.status(400).send({"responseCode":badRequestcode,"message": "Bad request check input parameters"});           
        }
}