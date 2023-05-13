var authController = require('../controllers/authControllers');
module.exports = function(app) {
	   
    const fdsummary = require('../controllers/fdSummary.js');
    app.post('/tnpfc/ipad/getFdSummary',authController.verifyToken,fdsummary.depositSummary);
	//app.post('/tnpfc/v1/getFdSummary',fdsummary.depositSummary);
}