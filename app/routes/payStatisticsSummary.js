module.exports = function(app) {
	   
    const paymentStatistics = require('../controllers/payStatisticsSummary.js');
    app.post('/tnpfc/v1/paymentStatisticsSummary', paymentStatistics.statisticsSummary);
}