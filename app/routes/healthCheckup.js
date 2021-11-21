module.exports = function(app) {
	   
    const healthCheck = require('../controllers/healthCheckup.js');
    app.get('/tnpfc/v1/healthCheck', healthCheck.check);
}