const MaskData = require('maskdata');

var maskNumber = function (val1) {  
 try{
        const maskPhoneOptions = {
            maskWith: "*",
            unmaskedStartDigits: 1, 
            unmaskedEndDigits: 4 
        };
        const maskedPhoneNumber = MaskData.maskPhone(val1, maskPhoneOptions);
        return maskedPhoneNumber;
    } 
    catch(err) {return console.log(err)}
}

module.exports = maskNumber;

