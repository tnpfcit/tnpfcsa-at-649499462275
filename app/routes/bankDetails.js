module.exports = function(app) {
	   
    const bnkdetails = require('../controllers/bankDetails.js');
    app.post('/tnpfc/v1/getBankCodesList', bnkdetails.bankcode);
    app.post('/tnpfc/v1/getBankStatesList', bnkdetails.bankstates);
    app.post('/tnpfc/v1/getBankCitiesList', bnkdetails.bankcities);
    app.post('/tnpfc/v1/getBankBranchList', bnkdetails.bankbranch);
    app.post('/tnpfc/v1/getBankIfsccode', bnkdetails.bankifsccode);
    app.post('/tnpfc/v1/getBankDetails', bnkdetails.details);
    
}