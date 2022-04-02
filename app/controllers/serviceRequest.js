const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var device = require('express-device');
var moment = require('moment');
var {
    responseMessage,
    sucessCode,
    resourceNotFoundcode,
    badRequestcode
} = require('../config/env');

exports.serviceRequest = (req, res) => {
    //var channelId = 'app';
    var channelId = req.device.type.toUpperCase();
    var agentId = 'SYS';
    var { 
           serviceType,
           depositNumber,
		   depositNo,
           customerId, 
           nomineeName, 
           relationship,
           guardianName, 
           nomineeDob, 
           guardianRelationship, 
           nomineeStatus, 
           bankName, 
           ifscCode,
           accountNumber, 
           accountHolderName,
           imagePath, 
           residentialStatus, 
           street, 
           area, 
           city, 
           district, 
           state, 
           pinCode, 
           countryCode, 
           addressType, 
           emailId,
           panNumber,
           assessmentYear,
           estimateInterest,
           estimateTotIncome,
           formFiled,
           aggregateAmt,
           name,
           dob,
           panVerified,
           idProofUrl,
           depositType,
           jointHolderName,
           phoneNumber,
           authSignName1,
           authSignDesignation1,
           authSignPhNumber1,
           authSignAadhaar1,
           authSignProfilePicUrl1,
           authSignSignatureUrl1,
           authSignName2,
           authSignDesignation2,
           authSignPhNumber2,
           authSignAadhaar2,
           authSignProfilePicUrl2,
           authSignSignatureUrl2,
           authSigndocumentUrl,
           sequenceNumber1,
           sequenceNumber2,
		   email1,
		   email2,
		   jointHolder2Name,
		   addressType,
		   perCountry,
		   corCountry,
		   addProofurl,
		   addressProofType
        } = req.body;

    logger.info(`
        ${res.StatusCode} || 
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);    

    guardianName = guardianName ? guardianName : null;
    guardianRelationship = guardianRelationship ? guardianRelationship : null;
    jointHolderName = jointHolderName ? jointHolderName : null;
	jointHolder2Name = jointHolder2Name ? jointHolder2Name : null;

    authSignName1 = authSignName1? authSignName1 : null;
    authSignDesignation1 = authSignDesignation1? authSignDesignation1 : null;
    authSignPhNumber1 = authSignPhNumber1?  authSignPhNumber1 : null;
    authSignAadhaar1 = authSignAadhaar1?  authSignAadhaar1 : null;
    authSignProfilePicUrl1 = authSignProfilePicUrl1? authSignProfilePicUrl1 : null;
    authSignSignatureUrl1 = authSignSignatureUrl1?  authSignSignatureUrl1 : null;
    authSignName2 = authSignName2?  authSignName2 : null;
    authSignDesignation2 = authSignDesignation2? authSignDesignation2 : null;
    authSignPhNumber2 = authSignPhNumber2?  authSignPhNumber2 : null;
    authSignAadhaar2 = authSignAadhaar2?  authSignAadhaar2 : null;
    authSignProfilePicUrl2 = authSignProfilePicUrl2? authSignProfilePicUrl2 : null;
    authSignSignatureUrl2 = authSignSignatureUrl2?  authSignSignatureUrl2 : null;
    authSigndocumentUrl = authSigndocumentUrl? authSigndocumentUrl : null;
    sequenceNumber1 = sequenceNumber1 ? sequenceNumber1 : null;
    sequenceNumber2 = sequenceNumber2 ? sequenceNumber2 : null;
	email1 = email1 ? email1 : null;
	email2 = email2 ? email2 : null;
	imagePath = imagePath ? imagePath : null;
	assessmentYear = assessmentYear?assessmentYear:null;
	addProofurl = addProofurl?addProofurl:null;
	addressProofType = addressProofType?addressProofType:null;
	
	
	console.log("================"+depositNo);
	
	if (depositNo instanceof Array) {
		depositNo = depositNo.map(element => element.depositNo).toString();
		depositNo = depositNo.replace(/\,/g, "|");
		
	}
	
	
	
	//code added to handle address proof url in service request TW-816 - 12/oct/2021 - karthi
	if (addProofurl instanceof Array) {
        addProofurl = addProofurl.map(element => element.url).toString();
        addProofurl = addProofurl.replace(/\,/g, "|");
    }
	
    
    
    // select customer name and phone number from db
    var query = 'select decode (c.cust_type,\'INDIVIDUAL\',c.fname,c.comp_name) as "depositorName",cp.phone_number "phNumber" from customer c left join cust_phone cp on c.cust_id = cp.cust_id where c.cust_id =:customerId';
    db.sequelize.query(query,{replacements:{customerId: customerId}, type: sequelize.QueryTypes.SELECT}
    ).then(results =>{
        if( results.length > 0){
            console.log(results);
            var phNumber = results[0].phNumber;
            var depositorName = results[0].depositorName.length>16? results[0].depositorName.substring(0,16):results[0].depositorName;
            
            if(serviceType == 'nomineeChange' && depositNumber && customerId && nomineeName && relationship && nomineeDob && nomineeStatus){

                        // new service request function 
                        db.sequelize.query('select API_WEBPORTAL_NOMINEE (:serviceType, :depositNumber, :customerId, :nomineeName,\
                            :relationship, :guardianName, :nomineeDob, :guardianRelationship, :nomineeStatus,:channelId,:agentId) as ACK_ID from dual',
                            {replacements: {
                                serviceType: serviceType, 
                                depositNumber: depositNumber, 
                                customerId: customerId, 
                                nomineeName: nomineeName, 
                                relationship: relationship, 
                                guardianName: guardianName, 
                                nomineeDob: nomineeDob, 
                                guardianRelationship: guardianRelationship, 
                                nomineeStatus: nomineeStatus, 
                                channelId: channelId,
                                agentId: agentId
                            },type: sequelize.QueryTypes.SELECT}
                        ).then(results => {
                            var info = "Nominee Change";
                            var ackId = results[0].ACK_ID;
                            require('../middleware/serviceRequestMessage.js')(depositorName,phNumber,info,ackId);
                            require('../middleware/servicerequestMessage1.js')(depositorName,phNumber,info,ackId);
                            return res.status(200).send({
                                "responseCode": "200", 
                                "response": results[0]
                            });
                        }).catch(err => {
                            logger.error("nominee function error"+err); 
                            res.status(500).send({
                                data:null, 
                                message: err.message 
                            }); 
                        });

            } else if (serviceType == "bankDetailsChange" && depositNumber && customerId && bankName && ifscCode && accountNumber && accountHolderName && imagePath){

                        db.sequelize.query('select API_WEBPORTAL_OTHER_BANK (:serviceType, :depositNumber, :customerId, :bankName,\
                            :ifscCode, :accountNumber, :accountHolderName, :imagePath, :channelId, :agentId) as ACK_ID from dual',
                            {replacements: {
                                serviceType: serviceType, 
                                depositNumber: depositNumber, 
                                customerId: customerId, 
                                bankName: bankName, 
                                ifscCode: ifscCode, 
                                accountNumber: accountNumber, 
                                accountHolderName: accountHolderName, 
                                imagePath: imagePath, 
                                channelId: channelId,
                                agentId: agentId
                            },type: sequelize.QueryTypes.SELECT}
                        ).then(results => {
                            var info = "Bank Details Change";
                            var ackId = results[0].ACK_ID;
                            require('../middleware/serviceRequestMessage.js')(depositorName,phNumber,info,ackId);
							require('../middleware/servicerequestMessage1.js')(depositorName,phNumber,info,ackId);
                            return res.status(200).send({
                                "responseCode":sucessCode,
                                "response": results[0]
                            });
                        }).catch(err => { 
                            logger.error("bank change function error"+err);
                            res.status(500).send({
                                data:null, 
                                message: err.message 
                            }); 
                        });
            } else if (serviceType == "addressChange" && customerId && residentialStatus && street && area && city && pinCode && countryCode && addressType){
						console.log ("url==="+addProofurl + "type====" +addressProofType);
                        db.sequelize.query('select API_WEBPORTAL_CUSTOMER_DETAILS (:serviceType, :customerId, :residentialStatus,\
                            :street, :area, :city, :district, :state, :pinCode, :countryCode, :addressType, :emailId, :channelId,:agentId, :addProofurl, :addressProofType) as ACK_ID from dual',
                            {replacements: {
                                serviceType: serviceType, 
                                customerId: customerId, 
                                residentialStatus: residentialStatus, 
                                street: street, 
                                area: area, 
                                city: city, 
                                district: district, 
                                state: state, 
                                pinCode: pinCode, 
                                countryCode: countryCode, 
                                addressType: addressType, 
                                emailId: emailId, 
                                channelId: channelId,
                                agentId: agentId,
								addProofurl: addProofurl,
								addressProofType: addressProofType
                            },type: sequelize.QueryTypes.SELECT}
                        ).then(results => {
							//modified by karthi on 3/11/2021 for TW-816
							if (addressType =='HOME' || addressType =='REG.OFFICE') {
								var info = "Permanent Address Change";
							} else {
								var info = "Correspondance Address Change";
							};
                            var ackId = results[0].ACK_ID;
                            require('../middleware/serviceRequestMessage.js')(depositorName,phNumber,info,ackId);
							require('../middleware/servicerequestMessage1.js')(depositorName,phNumber,info,ackId);
                            return res.status(200).send({
                                "responseCode":sucessCode, 
                                "response": results[0]
                            });
                        }).catch(err => {
                            logger.error("adress change function error"+err); 
                            res.status(500).send({
                                data:null, 
                                message: err.message 
                            }); 
                        });
            } else if (serviceType == "form15gSubmission" && customerId && depositNo && panNumber ){
                                    console.log("form coming==========");
                        db.sequelize.query('select API_WEBPORTAL_V1_G_DETAILS (:serviceType, :customerId, :depositNo, :panNumber,\
                            :assessmentYear, :estimateInterest, :estimateTotIncome, :formFiled, :aggregateAmt, :channelId,:agentId) as ACK_ID from dual',
                            {replacements: {
                                serviceType: serviceType, 
                                customerId: customerId, 
                                depositNo: depositNo, 
                                panNumber: panNumber, 
                                assessmentYear: assessmentYear, 
                                estimateInterest: estimateInterest, 
                                estimateTotIncome: estimateTotIncome, 
                                formFiled: formFiled, 
                                aggregateAmt: aggregateAmt, 
                                channelId: channelId,
                                agentId:agentId 
                            },type: sequelize.QueryTypes.SELECT}
                        ).then(results => {
                            var info = "Form15 submission";
                            var ackId = results[0].ACK_ID;
                            require('../middleware/serviceRequestMessage.js')(depositorName,phNumber,info,ackId);
                            require('../middleware/servicerequestMessage1.js')(depositorName,phNumber,info,ackId);
                            return res.status(200).send({
                                "responseCode":sucessCode, 
                                "response": results[0]
                            });
                        }).catch(err => { 
                            logger.error("15gh function error"+err);
                            res.status(500).send({
                                data:null, 
                                message: err.message 
                            }); 
                        });

            } else if (serviceType == "form15gSubmission" && customerId && depositNumber && panNumber /*&& estimateInterest && (estimateTotIncome || estimateTotIncome == 0)  && (formFiled || formFiled == 0)&& (aggregateAmt || aggregateAmt == 0 )*/){

                        /*db.sequelize.query('select API_WEBPORTAL_G_DETAILS (:serviceType, :customerId, :depositNo, :panNumber,\
                            :assessmentYear, :estimateInterest, :estimateTotIncome, :formFiled, :aggregateAmt, :channelId,:agentId) as ACK_ID from dual',
                            {replacements: {
                                serviceType: serviceType, 
                                customerId: customerId, 
                                depositNo: depositNo, 
                                panNumber: panNumber, 
                                assessmentYear: assessmentYear, 
                                estimateInterest: estimateInterest, 
                                estimateTotIncome: estimateTotIncome, 
                                formFiled: formFiled, 
                                aggregateAmt: aggregateAmt, 
                                channelId: channelId,
                                agentId:agentId 
                            },type: sequelize.QueryTypes.SELECT}
                        ).then(results => {
                            var info = "Form15 submission";
                            var ackId = results[0].ACK_ID;
                            require('../middleware/serviceRequestMessage.js')(depositorName,phNumber,info,ackId);
                            require('../middleware/servicerequestMessage1.js')(depositorName,phNumber,info,ackId);
                            return res.status(200).send({
                                "responseCode":sucessCode, 
                                "response": results[0]
                            });
                        }).catch(err => { 
                            logger.error("15gh function error"+err);
                            res.status(500).send({
                                data:null, 
                                message: err.message 
                            }); 
                        });*/
						
						db.sequelize.query('select API_WEBPORTAL_G_DETAILS (:serviceType, :customerId, :depositNumber, :panNumber,\
                            :assessmentYear, :estimateInterest, :estimateTotIncome, :formFiled, :aggregateAmt, :channelId,:agentId) as ACK_ID from dual',
                            {replacements: {
                                serviceType: serviceType, 
                                customerId: customerId, 
                                depositNumber: depositNumber, 
                                panNumber: panNumber, 
                                assessmentYear: assessmentYear, 
                                estimateInterest: estimateInterest, 
                                estimateTotIncome: estimateTotIncome, 
                                formFiled: formFiled, 
                                aggregateAmt: aggregateAmt, 
                                channelId: channelId,
                                agentId:agentId 
                            },type: sequelize.QueryTypes.SELECT}
                        ).then(results => {
                            var info = "Form15 submission";
                            var ackId = results[0].ACK_ID;
                            require('../middleware/serviceRequestMessage.js')(depositorName,phNumber,info,ackId);
                            require('../middleware/servicerequestMessage1.js')(depositorName,phNumber,info,ackId);
                            return res.status(200).send({
                                "responseCode":sucessCode, 
                                "response": results[0]
                            });
                        }).catch(err => { 
                            logger.error("15gh function error"+err);
                            res.status(500).send({
                                data:null, 
                                message: err.message 
                            }); 
                        });
            } else if(serviceType == 'dob' && panNumber && dob && name && customerId) {
                
                dob = moment(dob).format('DD/MMM/YYYY');
                db.sequelize.query('select API_WEBPORTAL_DOB_SERVICE(:serviceType, :customerId,  :panNumber,\
                    :name, :dob, :panVerified, :idProofUrl, :channelId,:agentId) as ACK_ID from dual',
                    {replacements: {
                        serviceType: serviceType, 
                        customerId: customerId, 
                        panNumber: panNumber, 
                        name: name,
                        dob:dob,
                        panVerified:panVerified,
                        idProofUrl:idProofUrl,
                        channelId: channelId,
                        agentId:agentId 
                    },type: sequelize.QueryTypes.SELECT}
                ).then(results => {

                    var info = "dob change";
                    var ackId = results[0].ACK_ID;
                    require('../middleware/serviceRequestMessage.js')(depositorName,phNumber,info,ackId);
                    require('../middleware/servicerequestMessage1.js')(depositorName,phNumber,info,ackId);
                    return res.status(200).send({
                        "responseCode":sucessCode, 
                        "response": results[0]
                    });

                }).catch(err => {

                    logger.error("dob service error"+err);
                    res.status(500).send({
                        data:null, 
                        message: err.message 
                    }); 

                });

            } else if (serviceType == 'jointNameChange' && customerId && depositorName && depositType){
                
                db.sequelize.query('select API_WEBPORTAL_JH_SERVICE(:serviceType, :customerId,  :depositNumber,\
                    :depositType, :jointHolderName, :channelId,:agentId,:jointHolder2Name) as ACK_ID from dual',
                    {replacements: {
                        serviceType: serviceType, 
                        customerId: customerId, 
                        depositNumber: depositNumber, 
                        depositType: depositType,
                        jointHolderName:jointHolderName,
                        channelId: channelId,
                        agentId:agentId,
                        jointHolder2Name:jointHolder2Name						
                    },type: sequelize.QueryTypes.SELECT}
                ).then(results => {

                    var info = "joint name change";
                    var ackId = results[0].ACK_ID;
                    require('../middleware/serviceRequestMessage.js')(depositorName,phNumber,info,ackId);
                    require('../middleware/servicerequestMessage1.js')(depositorName,phNumber,info,ackId);
                    return res.status(200).send({
                        "responseCode":sucessCode, 
                        "response": results[0]
                    });

                }).catch(err => {

                    logger.error("dob service error"+err);
                    res.status(500).send({
                        data:null, 
                        message: err.message 
                    }); 

                });


            } else if (serviceType == 'signatoryChange' && customerId){
                console.log("signatory");

                db.sequelize.query('select API_WEBPORTAL_SIGNATORY_CHANGE(:serviceType, :customerId,:authSignName1,:authSignDesignation1,:authSignPhNumber1,:authSignAadhaar1,:authSignProfilePicUrl1,:authSignSignatureUrl1,\
                    :authSignName2,:authSignDesignation2,:authSignPhNumber2,:authSignAadhaar2,:authSignProfilePicUrl2,:authSignSignatureUrl2,:authSigndocumentUrl,:sequenceNumber1,:sequenceNumber2,:channelId,:agentId,:email1,:email2) as ACK_ID from dual',
                    {replacements: {
                        serviceType: serviceType, 
                        customerId: customerId,
                        authSignName1: authSignName1,
                        authSignDesignation1: authSignDesignation1,
                        authSignPhNumber1: authSignPhNumber1,
                        authSignAadhaar1: authSignAadhaar1,
                        authSignProfilePicUrl1: authSignProfilePicUrl1,
                        authSignSignatureUrl1: authSignSignatureUrl1, 
                        authSignName2: authSignName2,
                        authSignDesignation2: authSignDesignation2,
                        authSignPhNumber2: authSignPhNumber2,
                        authSignAadhaar2: authSignAadhaar2,
                        authSignProfilePicUrl2: authSignProfilePicUrl2,
                        authSignSignatureUrl2: authSignSignatureUrl2,
                        authSigndocumentUrl: authSigndocumentUrl, 
                        sequenceNumber1:sequenceNumber1,
                        sequenceNumber2:sequenceNumber2,
                        channelId:channelId,
                        agentId:agentId,
						email1:email1,
                        email2:email2						
                    },type: sequelize.QueryTypes.SELECT}
                ).then(results => {
                    console.log("signatory results"+results);
                    var info = "signatoryChange";
                    var ackId = results[0].ACK_ID;
                    require('../middleware/serviceRequestMessage.js')(depositorName,phNumber,info,ackId);
                    require('../middleware/servicerequestMessage1.js')(depositorName,phNumber,info,ackId);
                    return res.status(200).send({
                        "responseCode":sucessCode, 
                        "response": results[0]
                    });
                }).catch(err => {

                    logger.error("dob service error"+err);
                    res.status(500).send({
                        data:null, 
                        message: err.message 
                    }); 

                });
            
            } else if (serviceType == 'phoneNumberChange' && customerId && phoneNumber){
                console.log("hello");
                db.sequelize.query('select API_WEBPORTAL_PHONE_SERVICE(:serviceType, :customerId, :phoneNumber,\
                    :channelId,:agentId) as ACK_ID from dual',
                    {replacements: {
                        serviceType: serviceType, 
                        customerId: customerId, 
                        phoneNumber: phoneNumber, 
                        channelId: channelId,
                        agentId:agentId 
                    },type: sequelize.QueryTypes.SELECT}
                ).then(results => {
                    console.log("phone number results"+results);
                    var info = "phoneNumberChange";
                    var ackId = results[0].ACK_ID;
                    require('../middleware/serviceRequestMessage.js')(depositorName,phNumber,info,ackId);
                    require('../middleware/servicerequestMessage1.js')(depositorName,phNumber,info,ackId);
                    return res.status(200).send({
                        "responseCode":sucessCode, 
                        "response": results[0]
                    });

                }).catch(err => {

                    logger.error("dob service error"+err);
                    res.status(500).send({
                        data:null, 
                        message: err.message 
                    }); 

                });
            
            } else if (serviceType == 'emailChange' && customerId && emailId){

                db.sequelize.query('select API_WEBPORTAL_EMAIL_SERVICE(:serviceType, :customerId, :emailId,\
                    :channelId,:agentId) as ACK_ID from dual',
                    {replacements: {
                        serviceType: serviceType, 
                        customerId: customerId, 
                        emailId: emailId, 
                        channelId: channelId,
                        agentId:agentId 
                    },type: sequelize.QueryTypes.SELECT}
                ).then(results => {
                    console.log("email change results"+results);
                    var info = "emailChange";
                    var ackId = results[0].ACK_ID;
                    require('../middleware/serviceRequestMessage.js')(depositorName,phNumber,info,ackId);
                    require('../middleware/servicerequestMessage1.js')(depositorName,phNumber,info,ackId);
                    return res.status(200).send({
                        "responseCode":sucessCode, 
                        "response": results[0]
                    });

                }).catch(err => {

                    logger.error("dob service error"+err);
                    res.status(500).send({
                        data:null, 
                        message: err.message 
                    }); 

                });

            } else {
                return res.status(200).send({
                    "responseCode":badRequestcode,
                    "response":responseMessage
                });
            }
        }
    }).catch(err => {
        logger.error("selecting phone number function error"+err);
        res.status(500).send({
            data:null,
            message: err.message
        });
    });
}

// exports.dob = (req,res) => {
    
//     var {
//         panNumber,
//         dob,
//         name
//     } = req.body;

//     logger.info(`
//         ${res.StatusCode} || 
//         ${new Date()} || 
//         ${req.originalUrl} || 
//         ${JSON.stringify(req.body)} || 
//         ${req.ip} || 
//         ${req.protocol} || 
//         ${req.method}
//     `);
    
//     var query = 'select DOB "dob" from customer where pan_number=:panNumber';

//     db.sequelize.query(query,{replacements:{panNumber:panNumber},type:sequelize.QueryTypes.SELECT}
//     ).then(results => {
//         if(results.length > 0){
//             var resultDob = results[0].dob;
//             resultDob = moment(new Date(resultDob)).format('DD-MMM-YYYY');
//             var compare_dates = function(date1,date2){
//                 if (date1>date2 || date2>date1){
//                     res.send("unmatch");
//                 } else {
//                     res.send("match");
//                 }
//             }
//             compare_dates(new Date(dob),new Date(resultDob));
//         } else {

//         }

//     }).catch(err => {

//     });
// }