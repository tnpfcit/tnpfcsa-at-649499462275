module.exports = function (app) {
    const authController = require('../controllers/authControllers');
    var routePrefix = "/v1";
    // Azure authentication.
    app.post(routePrefix + '/auth', authController.azureAuthentication);
}