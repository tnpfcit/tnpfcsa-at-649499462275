module.exports = function(app) {
	   
    const customerdetails = require('../controllers/customerDetails.js');
    app.post('/tnpfc/v1/getCustomerDetails', app.oauth.authenticate(), customerdetails.findAll);
}