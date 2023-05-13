module.exports = function(app) {
    
    const searchDetails = require('../controllers/customerSearchNew.js');
    app.post('/tnpfc/v1/customerEnquiryNew',searchDetails.searchInformation);
}