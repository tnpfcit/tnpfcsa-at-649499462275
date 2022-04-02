module.exports = function(app) {
	   
    const hdfcResponse = require('../controllers/hdfcPaymentResponse.js');
    app.post('/tnpfc/v1/processPGResponse', hdfcResponse.paymentResponse);
}