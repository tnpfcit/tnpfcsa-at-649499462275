module.exports = function(app) {
    const customer = require('../controllers/newCustomer.js');
    app.post('/tnpfc/v1/newCustomerCreation', customer.creation);
}