module.exports = function(app) {
   
    const authenticationotp = require('../controllers/serviceAuthenticationOtp.js');
    app.post('/tnpfc/v1/sendSms',authenticationotp.authenticationOtp);
}