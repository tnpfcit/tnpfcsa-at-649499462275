const db = require('../config/db.js');
//const db = require('../config/db1.js');
const sequelize = require('sequelize');
//var jwt=require('jsonwebtoken');
var imageUpload = db.dmsImageUpload;

exports.imageUpload = (req,res) => {
    var customerId = req.body.customerId;
    var documentType = req.body.documentType;
	var imageFilePath = req.body.imageFilePath;
	console.log("path="+imageFilePath);
   

         imageUpload.findAll({ where: {CUST_ID: customerId,DOC_TYPE: documentType} }).then(results=>{
            //console.log(results);
			//var resultAaadhar = results[0].UNIQUE_ID;
            if (results.length > 0)
            {
              imageUpload.update({ FILE_NAME: imageFilePath},{ where: { CUST_ID: customerId,DOC_TYPE: documentType}}).then(results =>{ 
			 			return res.status(200).send({"message": "ok","responseCode":"200"});
                      }).catch(err => {
                      res.status(500).send({message: err.message || "Some error occurred "
                     });
                  });
            }
            else
            {
              imageUpload.build({ CUST_ID: customerId, DOC_TYPE: documentType,FILE_NAME:imageFilePath
								}).save().then(anotherTask => {return res.status(200).send({"message": "ok","responseCode":"200"});}).catch(err => {
                      res.status(500).send({message: err.message || "Some error occurred"
											});
					});               
            }

        }).catch(err => {
    res.status(500).send({
        message: err.message
    });
  });
            
    
		
}
     