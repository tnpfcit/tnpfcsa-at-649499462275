module.exports = function(app) {
	   
    const firstCustomer = require('../controllers/firstCustomer.js');
	//const newCustomerToken = require('../middleware/auth.js');
    app.post('/tnpfc/v1/createUser',app.oauth.authenticate(),firstCustomer.custCreation);
}