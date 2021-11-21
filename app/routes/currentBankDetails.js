module.exports = function(app) {
	   
    const bankDetailsUpdate = require('../controllers/currentBankDetails.js');
    app.post('/tnpfc/v1/bankDetails',app.oauth.authenticate(),bankDetailsUpdate.existingBankDetails);
}