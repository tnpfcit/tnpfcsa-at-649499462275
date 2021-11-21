module.exports = function(app) {
	   
    const panVerify = require('../controllers/panDocumentVerify.js');
    app.post('/tnpfc/v1/existingPanVerification',panVerify.panVerification);
	
}