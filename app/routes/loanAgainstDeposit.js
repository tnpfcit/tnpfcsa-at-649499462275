module.exports = function(app) {
	   
    const loanAgainstDeposit = require('../controllers/loanAgainstDeposit.js');
	//const loanAgainstDepositValidation = require('../middleware/loanAgainstDepositValidation.js');
    app.post('/tnpfc/v1/loanAgainstDeposit',app.oauth.authenticate(),loanAgainstDeposit.depositLoan);
    //app.post('/tnpfc/v1/loanAgainstDeposit',loanAgainstDepositValidation.validates('loanAgainstDeposit'),loanAgainstDeposit.depositLoan);
}