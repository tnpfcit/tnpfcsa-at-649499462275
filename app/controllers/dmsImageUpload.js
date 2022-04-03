const db = require('../config/db.js');
const sequelize = require('sequelize');
var imageUpload = db.dmsImageUpload;
var logger = require('../config/logger');
var {
    responseMessage,
    sucessCode,
    badRequestcode,
    resourceNotFoundcode,
    NoRecords
} = require('../config/env');

exports.imageUpload = (req,res) => {
  var {
    customerId,
    documentType,
    imageFilePath
  } = req.body;

  logger.info(`
    ${new Date()} || 
    ${req.originalUrl} || 
    ${JSON.stringify(req.body)} || 
    ${req.ip} || 
    ${req.protocol} || 
    ${req.method}
  `);
  
  imageUpload.findAll({where:{CUST_ID: customerId,DOC_TYPE: documentType}}
  ).then(results=>{
    if (results.length > 0){
      
      imageUpload.update({ FILE_NAME:imageFilePath},{where:{CUST_ID:customerId,DOC_TYPE:documentType}}
      ).then(results =>{
        return res.status(200).send({
          "responseCode":sucessCode
        });
      }).catch(err => {
          return res.status(500).send({
            data:null,
            message: err.message
          });
      });
    } else {
        imageUpload.build({ CUST_ID: customerId, DOC_TYPE: documentType,FILE_NAME:imageFilePath}
        ).save().then(anotherTask => {
          return res.status(200).send({
            "responseCode":sucessCode
          });
        }).catch(err => {
            return res.status(500).send({
              data:null,
              message: err.message
						});
				});               
    }
  }).catch(err => {
      return res.status(500).send({
        data:null,
        message: err.message
      });
  });
}
     