module.exports = function(app) {
	   
    const paymentService = require('../controllers/inrPaymentService.js');
    app.post('/tnpfc/v1/rtgsPaymentAdvice', paymentService.neft);
}