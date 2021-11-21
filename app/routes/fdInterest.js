module.exports = function(app) {
	   
    const interestDetails = require('../controllers/fdInterest.js');
    app.post('/tnpfc/v1/getFDInterestDetails',app.oauth.authenticate(),interestDetails.fdInterest);
    
}