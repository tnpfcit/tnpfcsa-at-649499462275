const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {
    responseMessage,
    sucessCode,
    badRequestcode,
    resourceNotFoundcode,
    NoRecords
} = require('../config/env');

exports.customerInformation = (req, res) => {
    
    var customerId = req.body.customerId;
  
    logger.info(`
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);
    
    if(customerId) {
        
        var query = 'select customerName "customerName", customerId "customerId", to_char(dob,\'dd-mm-yyyy\') "dob",gender "gender",\
        maritalStatus "maritalStatus", mobileNumber "mobileNumber", phoneNumber "phoneNumber",\
        emailId  "emailId", panNumber "panNumber", aadhaarNumber "aadhaarNumber", street "street",\
        area  "area",city "city", state "state",pincode "pincode", resident "resident",\
        customerType  "customerType",occupation  "occupation",customerCategory  "customerCategory",\
        salutation "salutation", isMinor "isMinor",taxableIncome "taxableIncome",profilePic "profilePic",\
        addressproof "addressProof", signature "signature", district "district", country "country",\
		commaddrstreet "commAddrStreet", commaddrarea "commAddrArea", commaddrcity "commAddrCity", \
		commaddrstate "commAddrState", commaddrpincode "commAddrPincode", commaddrdistrict "commAddrDistrict", commaddrcountry "commAddrCountry",tdsExemptionLimit "tdsExemptionLimit",isForm15Eligible "isForm15Eligible" from api_customerdetails  WHERE customerId =:customerId';
       
        // db query to fetch results
        db.sequelize.query(query,{replacements:{customerId:customerId},type: sequelize.QueryTypes.SELECT}
        ).then(results =>{
            
            if(results.length > 0){
                return res.status(200).send({
                    "responseCode":sucessCode,
                    "response":results
                });
            } else {
                return res.status(200).send({
                    "responseCode":resourceNotFoundcode,
                    "response":NoRecords
                });
            }
        }).catch(err => {
            logger.error(err);
            return res.status(500).send({
                data:null,
                message:err.message
            });
        });
    } else {
        // validation for request
        return res.status(200).send({
            "responseCode":badRequestcode,
            "response":responseMessage
        });
    }
}