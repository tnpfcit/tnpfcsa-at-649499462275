module.exports = function(app) {
	   
    const paymentResponse = require('../controllers/inrPaymentResponse.js');
    app.post('/tnpfc/v1/postRtgsNeftPayment', paymentResponse.neftResponse);
}