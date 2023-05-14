module.exports = function(app) {
	   
    const depositbankcreation = require('../controllers/depositbankCreation.js');
    app.post('/tnpfc/v1/updateBankDetails', depositbankcreation.depositbank);
}