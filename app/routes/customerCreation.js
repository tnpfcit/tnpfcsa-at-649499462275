module.exports = function(app) {
    const customercreation = require('../controllers/customerCreation.js');
    const customervalidation = require('../middleware/validate.js');
    app.post('/tnpfc/v1/customerCreation',customervalidation.validate('create1'), customercreation.create);
}