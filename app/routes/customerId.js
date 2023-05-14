module.exports = function(app) {
	   
    const cust = require('../controllers/customerId.js');
    app.post('/tnpfc/v1/getCustomerId',cust.customer);
}