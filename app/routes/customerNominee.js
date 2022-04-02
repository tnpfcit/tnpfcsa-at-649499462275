module.exports = function(app) {
	   
    const customernominee = require('../controllers/customerNominee.js');
    app.post('/tnpfc/v1/getCustomerNominees', customernominee.findAll);
}