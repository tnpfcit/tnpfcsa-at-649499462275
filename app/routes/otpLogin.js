module.exports = function(app) {
    const otplogin = require('../controllers/otpLogin.js');
    app.post('/tnpfc/v1/otplogin', otplogin.logincreation);
	app.post('/tnpfc/v1/sendFmsSMS', otplogin.sendsms);
   
}