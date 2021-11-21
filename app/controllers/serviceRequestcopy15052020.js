const db = require('../config/db.js');
const sequelize = require('sequelize');
var http = require('http');
var urlencode = require('urlencode');

exports.serviceRequest = (req, res) => {

    var { 
           serviceType, depositNumber, customerId, nomineeName, 
           relationship,guardianName, nomineeDob, guardianRelationship, 
           nomineeStatus, bankName, ifscCode,accountNumber, accountHolderName,imagePath, 
           residentialStatus, street, area, city, district, state, pinCode, 
           countryCode, addressType, emailId,panNumber,assessmentYear,estimateInterest,
           estimateTotIncome,formFiled,aggregateAmt

        } = req.body;
       
if (serviceType == 'nomineeChange' && depositNumber && customerId && nomineeName && relationship && nomineeDob && nomineeStatus) {
    
    db.sequelize.query("select distinct customer.cust_id,phone_number,email_id FROM cust_phone inner join customer on customer.cust_id = cust_phone.cust_id WHERE customer.cust_id =:customerId  ",
                  {replacements: {customerId : customerId },type: sequelize.QueryTypes.SELECT}).then(results=>{
                   
                   console.log(results);
                   console.log("djcjdjhdjhjdhkd");
                   if(results.length > 0)
                   {
                    if (typeof guardianName =="undefined")
                    {   
                        guardianName='';
                        guardianRelationship ='';
                    }
					     var phone = results[0].PHONE_NUMBER;
        
                        db.sequelize.query('select ACKNWLDGE_ID as "acknowledgementId" from WEB_PORTAL_DEP_NOMINEE_DETAIL WHERE cust_id=:customerId and status = \'CREATED\' and authorize_status IS NULL and deposit_no =:depositNumber',
                        { replacements: { customerId: customerId, depositNumber: depositNumber}, type: sequelize.QueryTypes.SELECT } 
                        ).then(results => {
                        console.log(results);
                    
                    if ( results.length == 0 ) 
                    {
        
                        db.sequelize.query('select API_WEBPORTAL_NOMINEE (:serviceType, :depositNumber, :customerId, :nomineeName, :relationship, :guardianName, :nomineeDob, :guardianRelationship, :nomineeStatus) as ACK_ID from dual',
                        { replacements: { serviceType: serviceType, depositNumber: depositNumber, customerId: customerId, nomineeName: nomineeName, relationship: relationship, guardianName: guardianName, nomineeDob: nomineeDob, guardianRelationship: guardianRelationship, nomineeStatus: nomineeStatus },
                        type: sequelize.QueryTypes.SELECT}).then(results => {
                            var info = "Nominee Change"
                            var msg = urlencode('Dear Depositor, Your Service Request No. '+results[0].ACK_ID+' for '+info+' has been received by TN Power Finance for processing');
                            //console.log(msg);
                            var toNumber = phone;
                            console.log(toNumber);
                            var username = 'Pallavim@amiainfotech.com';
                            var hash = '8537c38575a09969ff49dee3cabfe46dcc070db98b86bae94f9996e138b096b5'; // 
                            var sender = 'TNPFCL';
                            var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;
                            var options = { host: 'api.textlocal.in', path: '/send?' + data };
                            callback = function (response) {
                            var str = '';
                            response.on('data', function (chunk) {
                            str += chunk;
                            });
                            response.on('end', function () {
                            
                            return res.status(200).send({ "responseCode": "200", "response": results[0] });
	                      });
                        }
                         http.request(options, callback).end();

                        //return res.status(200).send({ "responseCode": "200", "response": results[0] });
                        }).catch(err => { res.status(500).send({ message: err.message }); });
                    }
                    else
                    {
                        return res.status(200).send({ "response": "Your Service Request Reference "+ results[0].acknowledgementId +" is waiting for processing. Please try again later." });
                    }
            }).catch(err => { res.status(500).send({ message: err.message }); });

                   }
                   else
                   {
                       return res.status(200).send({"response":"Phone Number Not Found"});
                   }
                  }).catch(err => { res.status(500).send({ message: err.message }); });
    
    
}

//---------------------   bank deatils change start ----------------------------------//

else if (serviceType == "bankDetailsChange" && depositNumber && customerId && bankName && ifscCode && accountNumber && accountHolderName && imagePath) {
        
    db.sequelize.query("select distinct customer.cust_id,phone_number,email_id FROM cust_phone inner join customer on customer.cust_id = cust_phone.cust_id WHERE customer.cust_id =:customerId  ",
                  {replacements: {customerId : customerId },type: sequelize.QueryTypes.SELECT}).then(results=>{
                   
                   console.log(results);

                   if ( results.length > 0)
                {
                     //console.log(phone);
					 var phone = results[0].PHONE_NUMBER;
                    db.sequelize.query('select ACKNWLDGE_ID as "acknowledgementId" from WEB_PORTAL_DEP_OTHER_BANK WHERE cust_id=:customerId and status = \'CREATED\' and authorize_status IS NULL and deposit_no =:depositNumber',
                    { replacements: { customerId: customerId, depositNumber: depositNumber}, type: sequelize.QueryTypes.SELECT } 
                    ).then(results => {
                    console.log(results);
                    
                    if ( results.length == 0) 
                    {
                             //console.log("fjdhjfhjfhjdhfjfhjfh"+phone);
                            db.sequelize.query('select API_WEBPORTAL_OTHER_BANK (:serviceType, :depositNumber, :customerId, :bankName, :ifscCode, :accountNumber, :accountHolderName, :imagePath) as ACK_ID from dual',
                            {replacements: { serviceType: serviceType, depositNumber: depositNumber, customerId: customerId, bankName: bankName, ifscCode: ifscCode, accountNumber: accountNumber, accountHolderName: accountHolderName, imagePath: imagePath },
                            type: sequelize.QueryTypes.SELECT}).then(results => {
                            console.log(results);
                            var info = "Bank Details Change"
                            var msg = urlencode('Dear Depositor, Your Service Request No. '+results[0].ACK_ID+' for '+info+' has been received by TN Power Finance for processing');
                            //console.log(msg);
                            var toNumber = phone;
                            console.log(toNumber);
                            var username = 'Pallavim@amiainfotech.com';
                            var hash = '8537c38575a09969ff49dee3cabfe46dcc070db98b86bae94f9996e138b096b5'; // 
                            var sender = 'TNPFCL';
                            var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;
                            var options = { host: 'api.textlocal.in', path: '/send?' + data };
                            callback = function (response) {
                            var str = '';
                            response.on('data', function (chunk) {
                            str += chunk;
                            });
                            response.on('end', function () {
                            
                            return res.status(200).send({ "responseCode": "200", "response": results[0] });
	                      });
                        }
                         http.request(options, callback).end();
                            // return res.status(200).send({ "responseCode": "200", "response": results[0] });
                        }).catch(err => { res.status(500).send({ message: err.message }); });
                    }
                    else 
                    {
                           
                        return res.status(200).send({ "response": "Your Service Request Reference "+ results[0].acknowledgementId +" is waiting for processing. Please try again later." }); 
                    }
                }).catch(err => { res.status(500).send({ message: err.message }); });

            }
        else
            {
                return res.status(200).send({"response":"Phone Number Not Found"});
            }
    }).catch(err => { res.status(500).send({ message: err.message }); });
}

//------------------ adress change starts --------------------------------------------//

else if (serviceType == "addressChange" && customerId && residentialStatus && street && area && city && district && state && pinCode && countryCode && addressType) {
    
    db.sequelize.query("select distinct customer.cust_id,phone_number,email_id FROM cust_phone inner join customer on customer.cust_id = cust_phone.cust_id WHERE customer.cust_id =:customerId  ",
                  {replacements: {customerId : customerId },type: sequelize.QueryTypes.SELECT}).then(results=>{
                   
                   console.log(results);
                   if(results.length > 0)
                   {
					   if (typeof emailId =="undefined")
                    {   
                        emailId='';
                        //guardianRelationship ='';
                    }
					var phone = results[0].PHONE_NUMBER;
                    db.sequelize.query('select ACKNWLDGE_ID as "acknowledgementId" from WEB_PORTAL_CUSTOMER WHERE cust_id=:customerId and authorize_status IS NULL and status = \'CREATED\'',
                    { replacements: { customerId: customerId }, type: sequelize.QueryTypes.SELECT }
                    ).then(results => {
                    console.log(results);
                    //console.log(results[0].phoneNumber);
                          
                        if (results.length == 0) 
                            {
                                    db.sequelize.query('select API_WEBPORTAL_CUSTOMER_DETAILS (:serviceType, :customerId, :residentialStatus, :street, :area, :city, :district, :state, :pinCode, :countryCode, :addressType, :emailId) as ACK_ID from dual',
                                    {replacements: { serviceType: serviceType, customerId: customerId, residentialStatus: residentialStatus, street: street, area: area, city: city, district: district, state: state, pinCode: pinCode, countryCode: countryCode, addressType: addressType, emailId: emailId },
                                    type: sequelize.QueryTypes.SELECT}).then(results => {
                                        console.log(results);
                            var info = "Correspondance Address Change"
                            var msg = urlencode('Dear Depositor, Your Service Request No. '+results[0].ACK_ID+' for '+info+' has been received by TN Power Finance for processing');
                            //console.log(msg);
                            var toNumber = phone;
                            console.log(toNumber);
                            var username = 'Pallavim@amiainfotech.com';
                            var hash = '8537c38575a09969ff49dee3cabfe46dcc070db98b86bae94f9996e138b096b5'; // 
                            var sender = 'TNPFCL';
                            var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;
                            var options = { host: 'api.textlocal.in', path: '/send?' + data };
                            callback = function (response) {
                            var str = '';
                            response.on('data', function (chunk) {
                            str += chunk;
                            });
                            response.on('end', function () {
                            
                            return res.status(200).send({ "responseCode": "200", "response": results[0] });
	                      });
                        }
                         http.request(options, callback).end();

                                    //return res.status(200).send({ "responseCode": "200", "response": results[0] });
                                    }).catch(err => { res.status(500).send({ message: err.message }); });
                            }
                        else 
                            {
                                    return res.status(200).send({ "response": "Your Service Request Reference "+ results[0].acknowledgementId +" is waiting for processing. Please try again later." });
                            }
                    }).catch(err => { res.status(500).send({ message: err.message }); });

                   }
                   else
                   {
                      return res.status(200).send({"response":"Phone Number Not Found"});
                   }
                
                }).catch(err => { res.status(500).send({ message: err.message }); });
    
}

//----------------------  form 15 g submission  starts ------------------------------------------//

else if (serviceType == "form15gSubmission" && customerId && depositNumber && panNumber && assessmentYear && estimateInterest && estimateTotIncome && formFiled && aggregateAmt) {

    db.sequelize.query("select distinct customer.cust_id,phone_number,email_id FROM cust_phone inner join customer on customer.cust_id = cust_phone.cust_id WHERE customer.cust_id =:customerId  ",
                  {replacements: {customerId : customerId },type: sequelize.QueryTypes.SELECT}).then(results=>{
                   
                   console.log(results);
                   if(results.length > 0 )
                   {
					 var phone = results[0].PHONE_NUMBER;
                    db.sequelize.query('select ACKNWLDGE_ID as "acknowledgementId" from WEB_PORTAL_G WHERE cust_id=:customerId and status = \'CREATED\' and deposit_no =:depositNumber',
                    { replacements: { customerId: customerId, depositNumber: depositNumber }, type: sequelize.QueryTypes.SELECT }
                    ).then(results => {
                    console.log(results);
                       
                    if (results.length == 0) 
                        {
                            db.sequelize.query('select API_WEBPORTAL_G_DETAILS (:serviceType, :customerId, :depositNumber, :panNumber, :assessmentYear, :estimateInterest, :estimateTotIncome, :formFiled, :aggregateAmt) as ACK_ID from dual',
                            {replacements: { serviceType: serviceType, customerId: customerId, depositNumber: depositNumber, panNumber: panNumber, assessmentYear: assessmentYear, estimateInterest: estimateInterest, estimateTotIncome: estimateTotIncome, formFiled: formFiled, aggregateAmt: aggregateAmt },
                            type: sequelize.QueryTypes.SELECT}).then(results => {

                                

                            var info = "Form15 submission"
                            var msg = urlencode('Dear Depositor, Your Service Request No. '+results[0].ACK_ID+' for '+info+' has been received by TN Power Finance for processing');
                            //console.log(msg);
                            var toNumber = phone;
                            console.log(toNumber);
                            var username = 'Pallavim@amiainfotech.com';
                            var hash = '8537c38575a09969ff49dee3cabfe46dcc070db98b86bae94f9996e138b096b5'; // 
                            var sender = 'TNPFCL';
                            var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;
                            var options = { host: 'api.textlocal.in', path: '/send?' + data };
                            callback = function (response) {
                            var str = '';
                            response.on('data', function (chunk) {
                            str += chunk;
                            });
                            response.on('end', function () {
                            
                            return res.status(200).send({ "responseCode": "200", "response": results[0]});
	                      });
                        }
                         http.request(options, callback).end();

                            //return res.status(200).send({ "responseCode": "200", "response": results[0] });
                            }).catch(err => { res.status(500).send({ message: err.message }); });
                        }
                    else 
                    {
                            return res.status(200).send({ "response": "Your Service Request Reference "+ results[0].acknowledgementId +" is waiting for processing. Please try again later." });
                    }
                }).catch(err => { res.status(500).send({ message: err.message }); });

                   }
                   else
                   {
                     return res.status(200).send({"response":"Phone Number Not Found"});
                   }
                  }).catch(err => { res.status(500).send({ message: err.message }); });
   }
    else 
        {
             return res.status(400).send({ "response": "Invalid input parameters check key and value pair correctly" });
        }
}
