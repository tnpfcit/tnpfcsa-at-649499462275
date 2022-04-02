const db = require('../config/db.js');
const sequelize = require('sequelize');
//const sendmail = require('sendmail')();
var nodemailer = require('nodemailer');

function sendingMail (otp,email,channel,depName) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'power@tnpowerfinance.com',
          pass: 'X*>C52u4'
        }
    });
    
    if(channel == 'web'){

      var mailOptions = {
        from: 'power@tnpowerfinance.com',
        to: email,
        subject: 'OTP for TNPFC Depositor login',
        text:'Dear '+depName+', '+otp+' is the One Time Password to log in to the TNPFCL WebPortal.\n\
        \n\
        Disclaimer:This E-Mail may contain Confidential and/or legally privileged Information and is meant for the intended recipient(s) only.If you have received this e-mail in error and are not the intended recipient/s, kindly delete this e-mail immediately from your system.You are also hereby notified that any use, any form of reproduction, dissemination, copying, disclosure, modification, distribution and/or publication of this e-mail, its contents or its attachment/s other than by its intended recipient/s is strictly prohibited and may be construed unlawful.Internet Communications cannot be guaranteed to be secure or error-free as information could be delayed, intercepted, corrupted, lost, or may contain viruses. TNPFCL does not accept any liability for any errors, omissions, viruses or computer shutdown (s) or any kind of disruption/denial of services if any experienced by any recipient as a result of this e-mail.'
      }

    } else {

      var mailOptions = {
        from: 'power@tnpowerfinance.com',
        to: email,
        subject: 'OTP for TNPFC Depositor login',
        text:'Dear '+depName+', '+otp+' is the One Time Password to log in to the TNPFCL Mobile App.\n\
        \n\
        Disclaimer:This E-Mail may contain Confidential and/or legally privileged Information and is meant for the intended recipient(s) only.If you have received this e-mail in error and are not the intended recipient/s, kindly delete this e-mail immediately from your system.You are also hereby notified that any use, any form of reproduction, dissemination, copying, disclosure, modification, distribution and/or publication of this e-mail, its contents or its attachment/s other than by its intended recipient/s is strictly prohibited and may be construed unlawful.Internet Communications cannot be guaranteed to be secure or error-free as information could be delayed, intercepted, corrupted, lost, or may contain viruses. TNPFCL does not accept any liability for any errors, omissions, viruses or computer shutdown (s) or any kind of disruption/denial of services if any experienced by any recipient as a result of this e-mail.'
      }

    }
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = sendingMail;