var authController = require('../controllers/authControllers');
module.exports = function (app) {
    const userController = require('../controllers/userControllers');
    var routePrefix = "/v1";
    // Azure authentication.
    app.post(routePrefix + '/users', userController.getUsers);
    app.post(routePrefix + '/users/details', userController.getUserByUsername);
}