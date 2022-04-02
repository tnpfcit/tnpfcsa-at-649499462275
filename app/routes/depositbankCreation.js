module.exports = function(app) {
	   
    const depositbankcreation = require('../controllers/depositbankCreation.js');
    //const depositvalidationn = require('../middleware/depositbankvalidation.js');
    app.post('/tnpfc/v1/updateBankDetails', depositbankcreation.depositbank);
}