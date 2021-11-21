module.exports = function(app) {
    
    const signatory = require('../controllers/authSignatoryDetails.js');
    app.post('/tnpfc/v1/signatoryDetails', signatory.nonIndividualSignatory);
}