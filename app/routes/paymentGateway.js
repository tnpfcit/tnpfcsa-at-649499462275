module.exports = function(app) {
	   
    const paymentGateway = require('../controllers/paymentGateway.js');
	//const gatewayToken = require('../middleware/auth.js');
    app.post('/tnpfc/v1/getPGPayload',app.oauth.authenticate(), paymentGateway.payment);
}