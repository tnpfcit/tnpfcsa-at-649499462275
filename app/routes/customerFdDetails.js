var authController = require('../controllers/authControllers');
module.exports = function(app) {	   
    const fddetails = require('../controllers/fdDetails.js');
	app.post('/tnpfc/ipad/getallFdDetails',authController.verifyToken, fddetails.depositDetails);
    //app.post('/tnpfc/v1/getallFdDetails',fddetails.depositDetails);
}