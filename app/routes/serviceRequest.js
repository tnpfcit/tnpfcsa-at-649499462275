module.exports = function(app) {
   
    const service = require('../controllers/serviceRequest.js');
    //app.post('/tnpfc/v1/createServiceRequest',app.oauth.authenticate(),service.serviceRequest);
	app.post('/tnpfc/v1/createServiceRequest',service.serviceRequest);
}