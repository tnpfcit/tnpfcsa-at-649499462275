const db = require('../config/db.js');
var jwt=require('jsonwebtoken');
const checkAuth = (req, res, next) => {
var token = req.headers['x-access-token'];
console.log("token===="+token);
var secret = "FINCURO_API_TNPFC";

if (!token)
   return res.status(401).send({ auth: false, message: 'No token provided.' });

jwt.verify(token, secret, (err, decoded) => {
    if (err)
       return res.status(403).send({ auth: false, message: 'Access Forbidden. Invalid Token' });
       next();
    });
}
module.exports = {
    checkAuth
}