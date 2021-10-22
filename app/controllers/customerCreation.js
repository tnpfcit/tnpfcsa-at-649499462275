const db = require('../config/db.js');
const moment = require('moment');
const sequelize = require('sequelize');
var validator = require('validator');
const logger = require('../config/logger.js');
const customervalidation = require('../middleware/validate.js');
var ageCalculator = require('age-calculator');
let {AgeFromDateString, AgeFromDate} = require('age-calculator');
const { validationResult } = require('express-validator');
//var sms = require('free-mobile-sms-api');
var cust = db.customer;
var ags = db.getagelist;

exports.create = (req,res) => {

     const errors = validationResult(req);
     customervalidation.validate('create1');
     if (!errors.isEmpty()) {res.status(422).json({errors: errors.array()});return;}

var {title, fName, dob, panNumber,emailId,relativeName,gender,aadharNumber,idProofNumber, phoneNumber,guardianName,
guardianPhNumber,guardianrelationship,guardianAddress,landlineNumber,permanentAddress, permanentAddcity, permanentAddstate, permanentAddcountry, guardianCity, guardianState, guardianCountry }   = req.body;

cust.findAll({where:{PAN_NUMBER: req.body.panNumber}}).then(results=>{

    if(results.length>0)
      {
          return res.status(200).send({"responseCode":"200","message":"panNumber already exists"});
      }
    else
      {
            db.sequelize.query('select API_customercreation (:title, :fName, :dob, :panNumber, :emailId, :relativeName, :gender, :aadharNumber, :idProofNumber, :phoneNumber, :guardianName, :guardianPhNumber, :guardianrelationship, :guardianAddress, :landlineNumber, :permanentAddress, :permanentAddcity, :permanentAddstate, :permanentAddcountry, :guardianCity, :guardianState, :guardianCountry ) as CUST_ID from dual',
             {replacements: {title: title, fName: fName, dob: dob, panNumber: panNumber, emailId: emailId, relativeName: relativeName, gender: gender, aadharNumber: aadharNumber, idProofNumber: idProofNumber, phoneNumber: phoneNumber, guardianName: guardianName, guardianPhNumber: guardianPhNumber,
             guardianrelationship: guardianrelationship, guardianAddress: guardianAddress, landlineNumber: landlineNumber, permanentAddress: permanentAddress, permanentAddcity: permanentAddcity, permanentAddstate: permanentAddstate, permanentAddcountry: permanentAddcountry, guardianCity: guardianCity, guardianState: guardianState, guardianCountry: guardianCountry }}).then(results=>{
             return res.status(200).send({"message": "ok","responseCode":"200","response":results[0]});
             }); 
      }
    });
}
