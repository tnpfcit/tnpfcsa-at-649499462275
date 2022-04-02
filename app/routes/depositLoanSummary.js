module.exports = function(app) {
	   
    const loanSummary = require('../controllers/depositLoanSummary.js');
    app.post('/tnpfc/v1/getDepositLoanDetails',loanSummary.singleLoanDetails);
}