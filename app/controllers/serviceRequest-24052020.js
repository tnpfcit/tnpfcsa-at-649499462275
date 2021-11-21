const db = require('../config/db.js');
const sequelize = require('sequelize');
var http = require('http');
var device = require('express-device');
var urlencode = require('urlencode');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode} = require('../config/env');

exports.serviceRequest = (req, res) => {
    var channelId = req.device.type.toUpperCase();
    var { 
           serviceType, depositNumber, customerId, nomineeName, 
           relationship,guardianName, nomineeDob, guardianRelationship, 
           nomineeStatus, bankName, ifscCode,accountNumber, accountHolderName,imagePath, 
           residentialStatus, street, area, city, district, state, pinCode, 
           countryCode, addressType, emailId,panNumber,assessmentYear,estimateInterest,
           estimateTotIncome,formFiled,aggregateAmt

        } = req.body;

    guardianName = guardianName ? guardianName : null;
    guardianRelationship = guardianRelationship ? guardianRelationship : null;
    
    // select customer name and phone number from db
    var query = 'select c.fname "depositorName",cp.phone_number "phoneNumber" from customer c left join cust_phone cp on c.cust_id = cp.cust_id where c.cust_id =:customerId';
    db.sequelize.query(query,{replacements:{customerId: customerId}, type: sequelize.QueryTypes.SELECT}
    ).then(results =>{
        if( results.length > 0){
            console.log(results);
            var phoneNumber = results[0].phoneNumber;
            var depositorName = results[0].depositorName.length>16? results[0].depositorName.substring(0,16):results[0].depositorName;
            if(serviceType == 'nomineeChange' && depositNumber && customerId && nomineeName && relationship && nomineeDob && nomineeStatus){
                //checking existing service request ackid
                db.sequelize.query('select ACKNWLDGE_ID as "acknowledgementId" from WEB_PORTAL_DEP_NOMINEE_DETAIL WHERE cust_id=:customerId and status = \'CREATED\' and authorize_status IS NULL and deposit_no =:depositNumber',
                    { replacements: { customerId: customerId, depositNumber: depositNumber}, type: sequelize.QueryTypes.SELECT } 
                ).then(results => {
                    if(results.length == 0){
                        console.log(results);
                        // new service request function 
                        db.sequelize.query('select API_WEBPORTAL_NOMINEE (:serviceType, :depositNumber, :customerId, :nomineeName, :relationship, :guardianName, :nomineeDob, :guardianRelationship, :nomineeStatus,:channelId) as ACK_ID from dual',
                            {replacements: { serviceType: serviceType, depositNumber: depositNumber, customerId: customerId, nomineeName: nomineeName, relationship: relationship, guardianName: guardianName, nomineeDob: nomineeDob, guardianRelationship: guardianRelationship, nomineeStatus: nomineeStatus, channelId: channelId },type: sequelize.QueryTypes.SELECT}
                        ).then(results => {
                            console.log(results);
                            var info = "Nominee Change";
                            var ackId = results[0].ACK_ID;
                            console.log(ackId)
                            require('../middleware/serviceRequestMessage.js')(depositorName,phoneNumber,info,ackId);
                            require('../middleware/servicerequestMessage1.js')(depositorName,phoneNumber,info,ackId);
                            return res.status(200).send({"responseCode": "200", "response": results[0]});
                        }).catch(err => { res.status(500).send({ message: err.message }); });
                    } else {
                        return res.status(200).send({ "response": "Your Service Request Reference "+ results[0].acknowledgementId +" is waiting for processing. Please try again later." });
                    }
                }).catch(err => { res.status(500).send({ message: err.message }); });
            } else if (serviceType == "bankDetailsChange" && depositNumber && customerId && bankName && ifscCode && accountNumber && accountHolderName && imagePath){
                db.sequelize.query('select ACKNWLDGE_ID as "acknowledgementId" from WEB_PORTAL_DEP_OTHER_BANK WHERE cust_id=:customerId and status = \'CREATED\' and authorize_status IS NULL and deposit_no =:depositNumber',
                    {replacements: { customerId: customerId, depositNumber: depositNumber}, type: sequelize.QueryTypes.SELECT } 
                ).then(results => {
                    if (results.length == 0){
                        db.sequelize.query('select API_WEBPORTAL_OTHER_BANK (:serviceType, :depositNumber, :customerId, :bankName, :ifscCode, :accountNumber, :accountHolderName, :imagePath, :channelId) as ACK_ID from dual',
                            {replacements: { serviceType: serviceType, depositNumber: depositNumber, customerId: customerId, bankName: bankName, ifscCode: ifscCode, accountNumber: accountNumber, accountHolderName: accountHolderName, imagePath: imagePath, channelId: channelId },type: sequelize.QueryTypes.SELECT}
                        ).then(results => {
                            var info = "Bank Details Change";
                            var ackId = results[0].ACK_ID;
                            require('../middleware/serviceRequestMessage.js')(depositorName,phoneNumber,info,ackId);
							require('../middleware/servicerequestMessage1.js')(depositorName,phoneNumber,info,ackId);
                            return res.status(200).send({"responseCode":sucessCode, "response": results[0]});
                        }).catch(err => { res.status(500).send({ message: err.message }); });
                    } else {
                        return res.status(200).send({"responseCode":sucessCode,"response": "Your Service Request Reference "+ results[0].acknowledgementId +" is waiting for processing. Please try again later." }); 
                    }
                }).catch(err => { res.status(500).send({ message: err.message }); });
            } else if (serviceType == "addressChange" && customerId && residentialStatus && street && area && city && district && state && pinCode && countryCode && addressType){
                db.sequelize.query('select ACKNWLDGE_ID as "acknowledgementId" from WEB_PORTAL_CUSTOMER WHERE cust_id=:customerId and authorize_status IS NULL and status = \'CREATED\'',
                    { replacements: { customerId: customerId }, type: sequelize.QueryTypes.SELECT }
                ).then(results => {
                    if(results.length == 0){
                        db.sequelize.query('select API_WEBPORTAL_CUSTOMER_DETAILS (:serviceType, :customerId, :residentialStatus, :street, :area, :city, :district, :state, :pinCode, :countryCode, :addressType, :emailId, :channelId) as ACK_ID from dual',
                            {replacements: { serviceType: serviceType, customerId: customerId, residentialStatus: residentialStatus, street: street, area: area, city: city, district: district, state: state, pinCode: pinCode, countryCode: countryCode, addressType: addressType, emailId: emailId, channelId: channelId},type: sequelize.QueryTypes.SELECT}
                        ).then(results => {
                            var info = "Correspondance Address Change";
                            var ackId = results[0].ACK_ID;
                            require('../middleware/serviceRequestMessage.js')(depositorName,phoneNumber,info,ackId);
							require('../middleware/servicerequestMessage1.js')(depositorName,phoneNumber,info,ackId);
                            return res.status(200).send({"responseCode":sucessCode, "response": results[0]});
                        }).catch(err => { res.status(500).send({ message: err.message }); });
                    } else {
                        return res.status(200).send({"responseCode":sucessCode,"response": "Your Service Request Reference "+ results[0].acknowledgementId +" is waiting for processing. Please try again later." }); 
                    }
                }).catch(err => { res.status(500).send({ message: err.message }); });

            } else if (serviceType == "form15gSubmission" && customerId && depositNumber && panNumber && assessmentYear && estimateInterest && estimateTotIncome && formFiled && aggregateAmt){
                db.sequelize.query('select ACKNWLDGE_ID as "acknowledgementId" from WEB_PORTAL_G WHERE cust_id=:customerId and status = \'CREATED\' and deposit_no =:depositNumber',
                    { replacements: { customerId: customerId, depositNumber: depositNumber }, type: sequelize.QueryTypes.SELECT }
                ).then(results => {
                    if (results.length == 0){
                        db.sequelize.query('select API_WEBPORTAL_G_DETAILS (:serviceType, :customerId, :depositNumber, :panNumber, :assessmentYear, :estimateInterest, :estimateTotIncome, :formFiled, :aggregateAmt) as ACK_ID from dual',
                            {replacements: { serviceType: serviceType, customerId: customerId, depositNumber: depositNumber, panNumber: panNumber, assessmentYear: assessmentYear, estimateInterest: estimateInterest, estimateTotIncome: estimateTotIncome, formFiled: formFiled, aggregateAmt: aggregateAmt },type: sequelize.QueryTypes.SELECT}
                        ).then(results => {
                            var info = "Form15 submission";
                            var ackId = results[0].ACK_ID;
                            require('../middleware/serviceRequestMessage.js')(depositorName,phoneNumber,info,ackId);
                            return res.status(200).send({"responseCode":sucessCode, "response": results[0]});
                        }).catch(err => { res.status(500).send({ message: err.message }); });
                    } else {
                        return res.status(200).send({"responseCode":sucessCode,"response": "Your Service Request Reference "+ results[0].acknowledgementId +" is waiting for processing. Please try again later." }); 
                    }
                }).catch(err => { res.status(500).send({ message: err.message });});
            } else {
                return res.status(400).send({"responseCode":badRequestcode,"response":responseMessage});
            }
        }
    }).catch(err => {res.status(500).send({message: err.message});});
}