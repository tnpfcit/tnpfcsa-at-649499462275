module.exports = function (app) {
    const menuController = require('../controllers/menuControllers');
    var routePrefix = "/v1";
    // Azure authentication.
    app.post(routePrefix + '/menus', menuController.getMenu);
}