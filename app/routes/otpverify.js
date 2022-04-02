module.exports = function(app) {
    const otpv = require('../controllers/otpverify.js');
    app.post('/tnpfc/v1/verifyotp', otpv.verifyotp)
   
}