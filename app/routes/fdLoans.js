module.exports = function(app) {
	   
    const loans = require('../controllers/fdLoans.js');
    app.post('/tnpfc/v1/getFdLoans',app.oauth.authenticate(), loans.loanDetails);
}