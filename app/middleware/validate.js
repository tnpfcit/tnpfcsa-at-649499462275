const  {body}  = require('express-validator');
exports.validate = (method) => {
    switch (method) {
    case 'create1' :{
    return[

        body('title', 'title allow only letters check input correctly').exists().isAlpha(),
        body('fName', 'name allow only letters check input correctly').exists().isAlpha(),
        body('dob', 'check dob format correctly').exists(),
        body('panNumber', 'panNumber allow letters and numbers check input corectly').exists().isAlphanumeric(),
        body('emailId', 'Invalid email').exists().isEmail(),
        body('relativeName', 'relativeName allow only letters check input correctly').exists().isAlpha(),
        body('gender', 'gender allow only letters check input correctly').exists().isAlpha(),
        body('aadharNumber', 'uniqueId allow letters and numbers check input corectly').exists().isAlphanumeric(),
        body('idProofNumber', 'rationNumber allow letters and numbers check input corectly').exists().isAlphanumeric(),
        body('phoneNumber', 'phoneNumber allow only 10 digits check input correctly').exists().isInt().isLength({min: 10, max: 10 }),
        body('guardianName', 'guardianName allow letters check input corectly').exists().isAlpha(),
        body('guardianPhNumber', 'phno allow only 10 digits check input correctly ').exists().isInt().isLength({min: 10, max: 10 }),
        body('guardianrelationship', 'relationship allow only letters check input correctly ').exists().isAlpha(),
        body('guardianAddress','address wrong check correctly').exists().isAscii(),
        body('landlineNumber', 'landline allow only 8 digits check input correctly').exists().isInt().isLength({min: 8, max: 8 }),
        body('permanentAddress', 'permanentAddress wrong check correctly').exists().isAscii(),
       // body('commuAddress', 'commuaddress wrong check correctly').exists().isAscii(),
        body('permanentAddcity', 'city allow only 3 number code check input correctly').exists().isInt().isLength({min: 3, max: 3 }),
        body('permanentAddstate', 'state allow only 2 number code check input correctly').exists().isInt().isLength({min: 2, max: 2 }),
        body('permanentAddcountry', 'country allow only 3 number code check input correctly').exists().isInt().isLength({min: 3, max: 3 }),
        body('guardianCity', 'city allow only 3 number code check input correctly').exists().isInt().isLength({min: 3, max: 3 }),
        body('guardianState', 'state allow only 2 number code check input correctly').exists().isInt().isLength({min: 2, max: 2 }),
        body('guardianCountry', 'country allow only 3 number code check input correctly').exists().isInt().isLength({min: 3, max: 3 }) 

    ]
  } 
  }
}