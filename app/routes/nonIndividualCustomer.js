module.exports = function(app) {
    const customer = require('../controllers/nonIndividualCustomer.js');
    app.post('/tnpfc/v1/createCorporateCustomer',app.oauth.authenticate(), customer.nonIndividualCustomer);
}