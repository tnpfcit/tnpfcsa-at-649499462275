module.exports = function(app) {
	   
    const loanAgainstDeposit = require('../controllers/loanAgainstDeposit.js');
    app.post('/tnpfc/v1/loanAgainstDeposit',app.oauth.authenticate(),loanAgainstDeposit.depositLoan);
}    