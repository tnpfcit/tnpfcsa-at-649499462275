module.exports = function(app) {
	   
    const intDetails = require('../controllers/depositInterestDetails.js');
    app.post('/tnpfc/v1/getDepInterestDetails',intDetails.depositInterestDetails);
}