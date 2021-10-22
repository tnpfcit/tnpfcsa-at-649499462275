module.exports = function(app) {
	   
    const customer = require('../controllers/customerProfile.js');
    app.post('/tnpfc/v1/editCustomerProfile',customer.customerProfileInfo);
   
}