const db = require('../config/db.js');
const sequelize = require('sequelize');
const Speakeasy = require("speakeasy");
var moment = require('moment');
var jwt=require('jsonwebtoken');
var otp_login = db.otplogin;
var otp_phone = db.custphone;
var ootp = db.otpgeneration;

exports.verifyotp = (req,res) => {
    var otp = req.body.otp;
    var panNumber = req.body.panNumber.toUpperCase();
        
        db.sequelize.query("select API_generation(:otp, :panNumber)as seconds from dual",
        {replacements: {otp: otp, panNumber: panNumber}}).then(results=>{
          var result = results[0][0].SECONDS;
            if(result == null)
              {
                  return res.status(422).send({"responseCode":"422","message": "Invalid input parameters. Please check the key value pair in the request body."}); 
              }
             else if (result > 300)
              {
                 return res.status(200).send({"responseCode":"200","message": " otp time is expired "}); 
              }
             else
              {
                  var secret = "FINCURO_API_TNPFC";
                  var systemdt = new Date();
                  var oasys_tokenpart = {"otpp":otp,"pan":panNumber,"systemdate":systemdt};
                  var status = 'CLOSED';
                  ootp.update({ STATUS: status },{ where: { PAN_NUMBER : panNumber}}).then(results =>{ 
         
                      }).catch(err => {
                      res.status(500).send({message: err.message || "Some error occurred "
                     });
                  });

                   otp_login.findAll({ where: {PAN_NUMBER: panNumber} }).then(results=>{
                   var customerId = results[0].CUST_ID;
                   console.log(customerId);
                   var authToken=jwt.sign({oasys_tokenpart},secret,{expiresIn:'1h'});
                      res.send({"responseCode":"200","response": {authToken,customerId}});}).catch(err => {
                      res.status(500).send({message: err.message || "Some error occurred "
                     });

                   })

               }
            })
          }

 