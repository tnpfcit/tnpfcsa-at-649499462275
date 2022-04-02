module.exports = function(app) {
	   
    const updation = require('../controllers/appUpdation.js');
    app.get('/tnpfc/v1/check-mobile-app-version', updation.appupdate);
}