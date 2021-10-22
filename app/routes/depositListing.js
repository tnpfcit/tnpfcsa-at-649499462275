module.exports = function(app) {
	   
    const deposit_list = require('../controllers/depositListing.js');
    app.post('/tnpfc/v1/get15ghdepositList',deposit_list.depositList);
}