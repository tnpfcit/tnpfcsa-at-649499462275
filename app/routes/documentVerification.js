module.exports = function(app) {
    const documentVerification = require('../controllers/documentVerification.js');
   
    app.post('/tnpfc/v1/documentVerify', documentVerification.verify);
}