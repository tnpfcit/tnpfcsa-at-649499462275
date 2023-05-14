module.exports = function(app) {
    
    const searchDetails = require('../controllers/customerSearch.js');
    app.post('/tnpfc/v1/customerEnquiry',searchDetails.searchInformation);
}