var authController = require('../controllers/authControllers');
module.exports = function(app) {
    const requestStatus = require('../controllers/requestStatus.js');
    app.post('/tnpfc/ipad/requestStatus',authController.verifyToken,requestStatus.statusRequest);
}
