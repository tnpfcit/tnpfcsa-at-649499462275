//added for tw-947
var authController = require('../controllers/authControllers');
module.exports = function(app) {
    const txnslist = require('../controllers/getCfoAuthTxns.js');
	var routePrefix = "/v1";
    //app.post(routePrefix + '/getCfoAuthTxns',authController.verifyToken, txnslist.cfoAuthTxns);
	app.post(routePrefix + '/getCfoAuthTxns', txnslist.cfoAuthTxns);
}