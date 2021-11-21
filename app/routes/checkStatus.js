module.exports = function(app) {
	   
    const cheque = require('../controllers/checkStatus.js');
    app.post('/tnpfc/v1/getChequeStatus',cheque.chequeInformation);
}