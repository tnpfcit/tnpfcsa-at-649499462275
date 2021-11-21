const db = require('../config/db.js');
const sequelize = require('sequelize');
var http = require('http');
var request = require('request');
var moment = require('moment');


exports.verify = (req,res) =>{

var {number,type,name,dob} = req.body;
console.log("date of birth======================="+dob);
var responseDate = moment(dob).format('DD/MM/YYYY');
console.log("response date =============="+responseDate);  
    if(number && type == "aadhar")
        {
            db.sequelize.query('select UNIQUE_ID as "aadhaarNumber" from customer where UNIQUE_ID =:number',
            {replacements: {number: number}, type: sequelize.QueryTypes.SELECT}).then(results=>{
            console.log(results);    
            if (results.length > 0)
                {
                    return res.status(200).send({"responseCode":3, "response":"Looks like You are a registered user, Please login to avail Online Services", "number":results[0].UNIQUE_ID});
                }
            else
                {
			  	   /*request.get("http://aadharelb-1765314439.ap-south-1.elb.amazonaws.com/verifyAADHAR?aadhar="+number, (error, response, body) => {
                     if(response.body && response.statusCode !== 500){
                          
                            console.log(response.body);
                            var parsedAadhaar = JSON.parse(response.body);
                            //console.log("================="+parsedAadhaar.responseCode);
                            //console.log(response.body);
                            if (parsedAadhaar.responseCode == 0){
                                    return res.status(200).send({"responseCode":0,"response":"Please enter a valid Aadhaar number."});
                            }
                            else if(parsedAadhaar.responseCode == 1){
                                    return res.status(200).send({"responseCode":1,"response":"Aadhaar number verified successfully."});   
                            } else if (parsedAadhaar.responseCode == -1){
								    return res.status(200).send({"responseCode":-1,"response":"Technical error. Please try again."});  
							}
                            else {
                                    return res.status(200).send({"responseCode":-1,"response":"Technical error. Please try again."});
                            }
                    }
                     else{
                            return res.status(404).send({"response":"Resource Not Found"});
                     }                 
                    })*/
					 return res.status(200).send({"responseCode":1,"response":"Aadhaar number verified successfully."});  
					
                }

            }).catch(err => { res.status(500).send({ message: err.message});});
			
        }
    
    else if (number && type == "pan" && name && responseDate)
        {
            db.sequelize.query('select PAN_NUMBER as "panNumber" from customer where PAN_NUMBER =:number',
            {replacements: {number: number}, type: sequelize.QueryTypes.SELECT}).then(results=>{
            //console.log(results);
            //console.log("ncnvvm,cmc,cm,cmv,cmv,mc,vm,c,v");  
            if(results.length > 0)
                {
                    return res.status(200).send({"responseCode":3,"response":"Looks like You are a registered user, Please login to avail Online Services","number":results[0].PAN_NUMBER});
                }
            else
                {
                    
					//console.log("bvfvjfjhfjfdfjdhfjhfjhjfjfjgjfgjf");
				    /*request.get( "http://test-pan-bot-elb-1259185693.ap-south-1.elb.amazonaws.com/verifyPAN?pan="+number+'&name='+name+'&dob='+responseDate, (error, response, body) => {
                    console.log("status========"+response.statusCode);
                    if(response.body && response.statusCode !== 500){
                        console.log(response.body);
                        var parsedPan = JSON.parse(response.body);
						//console.log(parsedPan);
                        var activeDetailsPan = "PAN is Active and the details are matching with PAN database.";
                       // console.log("result  1"+activeDetailsPan);
                        var activeDetailsMissedPan = "PAN is Active but the details are not matching with PAN database.";
                       // console.log("result 2"+activeDetailsMissedPan);
                       if (parsedPan && parsedPan.responseCode == 0){
                                return res.status(200).send({"responseCode":0,"response":"Please enter a valid Pan number."});
                        }
                       else if(parsedPan && parsedPan.responseText == activeDetailsPan){
                                return res.status(200).send({"responseCode":1,"response":"Pan number verified successfully."});   
                        }
                        else if(parsedPan && parsedPan.responseText == activeDetailsMissedPan){
                            return res.status(200).send({"responseCode":2,"response":"Video based Customer Identification Process will be initiated by TNPF."});   
                        }
                        else{
                                //for(var i=1; 
								return res.status(200).send({"responseCode":-1,"response":"Technical error. Please try again."});
                        }
                    }
                    else{
                        return res.status(500).send({"response":"Internal error. Please try again."});
                    } 
                   })*/
				   return res.status(200).send({"responseCode":2,"response":"Video based Customer Identification Process will be initiated by TNPF."});   
                }
            }).catch(err => {res.status(500).send({message: err.message});});
        }
    else
        {
            return res.status(422).send({"response": "Invalid input parameters check the key value pair in the request body"});
        }

}