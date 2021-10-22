module.exports = function(app) {
    //const validate = require('express-validation')
    const requestStatus = require('../controllers/requestStatus.js');
    //const adr = require('../middleware/statusvalidation.js');
    app.post('/tnpfc/v1/requestStatus',requestStatus.statusRequest);
}