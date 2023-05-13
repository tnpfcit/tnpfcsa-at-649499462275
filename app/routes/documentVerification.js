module.exports = function(app) {
    const verification = require('../controllers/documentVerification.js');
   
    app.post('/tnpfc/v1/documentVerify', verification.documentVerification);
}