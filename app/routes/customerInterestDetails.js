var authController = require('../controllers/authControllers');
module.exports = function(app) {
    const custIntDetails = require('../controllers/customerInterestDetails.js');
    app.post('/tnpfc/ipad/getCustIntDetails',authController.verifyToken,custIntDetails.customerInterestDetails);
}
