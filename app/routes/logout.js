module.exports = function(app) {
	   
    const loggedout = require('../controllers/logout.js');
    app.post('/tnpfc/v1/otpLogout',app.oauth.authenticate(),loggedout.logout);
}