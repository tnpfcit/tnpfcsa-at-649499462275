module.exports = function(app) {
   
    const service = require('../controllers/serviceRequest.js');
 
    //app.post('/tnpfc/v1/createServiceRequest',app.oauth.authenticate(),service.serviceRequest);
	app.post('/tnpfc/v1/createServiceRequest',service.serviceRequest); // comment this line if service request to be stopped and uncomment the below line.
	//app.get('/tnpfc/v1/createServiceRequest',service.serviceRequest); 
}