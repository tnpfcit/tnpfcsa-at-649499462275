module.exports = function(app) {
	   
    const phoneNumber = require('../controllers/phoneVerification.js');
    app.post('/tnpfc/v1/registerPhoneNumber', phoneNumber.phoneRegister);
}