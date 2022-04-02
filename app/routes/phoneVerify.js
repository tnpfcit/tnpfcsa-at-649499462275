module.exports = function(app) {
	   
    const phone = require('../controllers/phoneVerify.js');
    app.post('/tnpfc/v1/verifyRegisterPhonenumber', phone.phoneVerify);
}