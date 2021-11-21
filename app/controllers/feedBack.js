const db = require('../config/db.js');
const sequelize = require('sequelize');
//const sendmail = require('sendmail')();
var nodemailer = require('nodemailer');
var logger = require('../config/logger');

exports.feedBack = (req,res) => {
	
	logger.info(
       `${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}`
    );

    var output = `<h3> FeedBack From Customer </h3>
    <ul>
      <li>Name: ${req.body.fullName}</li>
      <li>Email: ${req.body.emailId}</li>
      <li>Mobile Number: ${req.body.phoneNumber}</li>
      <li>Feedbacktype: ${req.body.feedBackType}</li>
      <li>Message: ${req.body.message}</li>
    </ul>`;

    var subjectType = req.body.feedBackType;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'power@tnpowerfinance.com',
          pass: 'X*>C52u4'
        }
      });
      
      var mailOptions = {
        from: 'power@tnpowerfinance.com',
        to: 'customersupport@tnpowerfinance.com',
        subject: subjectType,
        text: 'Feed Back Infornation',
        html: output
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
            return res.status(200).send({
                "responseCode":"200",
                "response":"Your FeedBack sent Sucessfully to TNPFC."
            });
			//console.log("sucess");
        }
      });
    //res.send('sucess');
}

