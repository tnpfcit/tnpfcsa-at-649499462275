module.exports = function(app) {
	   
    const year = require('../controllers/financialYear.js');
    app.post('/tnpfc/v1/financialYear', year.financialyear);
    
}