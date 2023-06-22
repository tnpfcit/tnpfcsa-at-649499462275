//added for tw-947
var authController = require('../controllers/authControllers');
module.exports = function(app) {
    const txnslist = require('../controllers/getCmdAuthTxns.js');
	var routePrefix = "/v1";
    app.post(routePrefix + '/getCmdAuthTxns',authController.verifyToken, txnslist.cmdAuthTxns);
	//app.post(routePrefix + '/getCmdAuthTxns', txnslist.cmdAuthTxns);
}
