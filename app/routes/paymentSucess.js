module.exports = function(app) {
    //const validate = require('express-validation')
    const sucess = require('../controllers/paymentSucess.js');
    const paymentToken = require('../middleware/auth.js');
    app.post('/tnpfc/v1/paymentSucess',app.oauth.authenticate(),sucess.paySucess);
}