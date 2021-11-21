module.exports = function(app) {
	   
    const nomineeDetailsUpdate = require('../controllers/currentNomineeDetails.js');
    //app.post('/tnpfc/v1/bankDetails',app.oauth.authenticate(), bankDetailsUpdate.existingBankDetails);
    app.post('/tnpfc/v1/getCustomerNomineeDetails',nomineeDetailsUpdate.nomineeDetails);
}