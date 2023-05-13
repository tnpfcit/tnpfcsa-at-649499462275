var authController = require('../controllers/authControllers');
module.exports = function(app) {
    const custFYIntDetails = require('../controllers/customerFyIntDetails.js');
    app.post('/tnpfc/ipad/getCustIntFinancialYears',authController.verifyToken,custFYIntDetails.customerFYIntDetails);
}
