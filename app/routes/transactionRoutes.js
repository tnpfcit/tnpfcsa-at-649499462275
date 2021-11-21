var authController = require('../controllers/authControllers');
module.exports = function (app) {
    const transactionController = require('../controllers/transactionControllers');
    var routePrefix = "/v1";
    // Azure authentication.
    app.post(routePrefix + '/transactions', transactionController.getTransactions);
	app.post(routePrefix + '/transactionDetail', transactionController.getTransactionDetail);
    app.post(routePrefix + '/transactions/status', transactionController.updateTransactionStatus);
	// authController.verifyToken,
}