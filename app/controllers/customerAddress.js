const db = require('../config/db.js');
const sequelize = require('sequelize');
var {
    responseMessage,
    sucessCode,
    resourceNotFoundcode,
    badRequestcode
} = require('../config/env');

exports.city = (req,res) =>{
 db.sequelize.query("select LOOKUP_REF_ID as \"cityCode\",LOOKUP_DESC as \"cityName\" from LOOKUP_MASTER WHERE LOOKUP_ID = 'CUSTOMER.CITY'", { type: sequelize.QueryTypes.SELECT}).then(results=>{
    if(results.length>0)
        {
            return res.status(200).send({"responseCode":"200","response":results});
        }
    else
        {
            return res.status(200).send({"responseCode":"455","message": "City details not found "});
        }
     }).catch(err => {res.status(500).send({message: err.message})
  });
}


/*exports.districts = (req,res) =>{
 db.sequelize.query("select LOOKUP_REF_ID as \"districtCode\",LOOKUP_REF_ID as \"districtName\" from LOOKUP_MASTER WHERE LOOKUP_ID = 'CUSTOMER.DISTRICT'", { type: sequelize.QueryTypes.SELECT, raw: true}).then(results=>{
    if(results.length>0)
        {
            return res.status(200).send({"responseCode":"200","response":results});
        }
    else
        {
            return res.status(200).send({"responseCode":"455","message": "District details not found "});
        }
     }).catch(err => {res.status(500).send({message: err.message})
  });
}*/


/*exports.districts = (req,res) =>{
 db.sequelize.query("select LOOKUP_REF_ID as \"districtCode\",LOOKUP_REF_ID as \"districtName\" from LOOKUP_MASTER A, API_DISTRICTS_DISPLAY_ORDER B WHERE\ A.LOOKUP_REF_ID = B.DISTRICT_KEY AND LOOKUP_ID = 'CUSTOMER.DISTRICT' ORDER BY B.DISPLAY_SEQUENCE", { type: sequelize.QueryTypes.SELECT}).then(results=>{
    if(results.length>0)
        {
            return res.status(200).send({"responseCode":"200","response":results});
        }
    else
        {
            return res.status(200).send({"responseCode":"455","message": "District details not found "});
        }
     }).catch(err => {res.status(500).send({message: err.message})
  });
}*/

exports.districts = (req,res) =>{

    var state = req.body.state;

    if(state){
        var query ='SELECT DISTINCT LOOKUP_REF_ID AS "districtCode", LOOKUP_DESC AS "districtName"\
        FROM LOOKUP_MASTER A, PINCODE_MASTER B\
        WHERE  (STATUS != \'DELETED\' OR STATUS IS NULL)\
        AND UPPER (LOOKUP_ID) = UPPER (\'CUSTOMER.DISTRICT\')\
        AND A.LOOKUP_REF_ID=B.DISTRICT  AND B.STATE=:state\
        ORDER BY LOOKUP_REF_ID';
 
        db.sequelize.query(query,{replacements:{state:state},type: sequelize.QueryTypes.SELECT}
        ).then(results=>{
            if(results.length > 0){
          
                return res.status(200).send({
                    "responseCode":sucessCode,
                    "response":results
                });
 
            } else {
          
                return res.status(200).send({
                    "responseCode":resourceNotFoundcode,
                    "response":[]
                });
            }
        }).catch(err => {
            return res.status(500).send({
                data:null,
                 message: err.message
            });
        });
        
    } else {

        var query = 'select LOOKUP_REF_ID as \"districtCode\",LOOKUP_REF_ID as \"districtName\"\
        from LOOKUP_MASTER A, API_DISTRICTS_DISPLAY_ORDER B WHERE\ A.LOOKUP_REF_ID = B.DISTRICT_KEY AND\
        LOOKUP_ID = \'CUSTOMER.DISTRICT\' ORDER BY B.DISPLAY_SEQUENCE';

        db.sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}
        ).then(results=>{
            if(results.length>0){
                return res.status(200).send({
                    "responseCode":"200",
                    "response":results
                });
            }
            else {
                return res.status(200).send({
                    "responseCode":"400",
                    "message": "District details not found"
                });
            }
        }).catch(err =>{
            res.status(500).send({
                data:null,
                message: err.message
            });
        });
    } 
}



exports.state = (req,res) =>{
    db.sequelize.query("select LOOKUP_REF_ID as \"stateCode\",LOOKUP_DESC as \"stateName\" from LOOKUP_MASTER WHERE LOOKUP_ID = 'CUSTOMER.STATE'", { type: sequelize.QueryTypes.SELECT}).then(results=>{
        if(results.length>0)
            {
                 return res.status(200).send({"message": "ok","responseCode":"200","response":results});
            }
        else
            {
                return res.status(200).send({"responseCode":"455","message": "State details not found "});
            }
        }).catch(err => { res.status(500).send({message: err.message})
    });
}

exports.country = (req,res) =>{
    db.sequelize.query("select LOOKUP_REF_ID as \"countryCode\",LOOKUP_DESC as \"countryName\" from LOOKUP_MASTER WHERE LOOKUP_ID = 'CUSTOMER.COUNTRY'", { type: sequelize.QueryTypes.SELECT}).then(results=>{
        if(results.length>0)
            {
                return res.status(200).send({"message": "ok","responseCode":"200","response":results});
            }
        else
            {
                return res.status(200).send({"responseCode":"455","message": "Country details not found "});
            }
            }).catch(err => {res.status(500).send({ message: err.message})
        });
}
		
exports.master = (req,res) =>{
    db.sequelize.query("select LOOKUP_REF_ID as \"lookupRefId\",LOOKUP_DESC \"lookupDesc\" from  LOOKUP_MASTER WHERE LOOKUP_ID = 'DEPOSITSPRODUCT.DEPOSITPERIOD' AND LOOKUP_REF_ID NOT IN (\'180\')", { type: sequelize.QueryTypes.SELECT}).then(results=>{
        if(results.length>0)
            {
                return res.status(200).send({"responseCode":"200","response":results});
            }
        else
            {
                return res.status(200).send({"responseCode":"455","message": "country details not found "});
            }
        }).catch(err => {res.status(500).send({ message: err.message})
    });
}


exports.locationList = (req,res) =>{
	console.log ("inside");
    db.sequelize.query("select pincode as \"pincode\", state as \"state\", district as \"district\" from  pincode_master", { type: sequelize.QueryTypes.SELECT}).then(results=>{
        if(results.length>0)
            {
                return res.status(200).send({"responseCode":"200","response":results});
            }
        else
            {
                return res.status(200).send({"responseCode":"404","message": "No Details Found"});
            }
        }).catch(err => {res.status(500).send({ message: err.message})
    });
}


exports.title = (req,res) =>{
	//console.log ("inside");
    db.sequelize.query("select LOOKUP_DESC as \"title\" from LOOKUP_MASTER WHERE LOOKUP_ID = 'CUSTOMER.TITLE'", { type: sequelize.QueryTypes.SELECT}).then(results=>{
        if(results.length > 0)
            {
                return res.status(200).send({"response":results});
            }
        else
            {
                return res.status(404).send({"response": "No Details Found"});
            }
        }).catch(err => {res.status(500).send({ message: err.message})
    });
}

exports.residentialStatus = (req,res) =>{
	//console.log ("inside");
    db.sequelize.query("select LOOKUP_REF_ID as \"residentCode\", LOOKUP_DESC as \"residentName\" from LOOKUP_MASTER WHERE LOOKUP_ID = 'CUSTOMER.RESIDENTIALSTATUS'", { type: sequelize.QueryTypes.SELECT}).then(results=>{
        if(results.length>0)
            {
                return res.status(200).send({"response":results});
            }
        else
            {
                return res.status(404).send({"response": "No Details Found"});
            }
        }).catch(err => {res.status(500).send({ message: err.message})
    });
}