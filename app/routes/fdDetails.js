module.exports = function(app) {
	   
    const fddetails = require('../controllers/fdDetails.js');
    app.post('/tnpfc/v1/getallFdDetails',app.oauth.authenticate(), fddetails.depositDetails);
}