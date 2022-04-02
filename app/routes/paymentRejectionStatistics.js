module.exports = function(app) {
	   
    const paymentRejection = require('../controllers/paymentRejectionStatistics.js');
    app.post('/tnpfc/v1/getPaymentRejectionStatistics', paymentRejection.rejectionSummary);
}