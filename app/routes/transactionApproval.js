module.exports = function(app) {
	   
    const transfer = require('../controllers/transactionApproval.js');
    app.post('/tnpfc/v1/transferApproval',transfer.transferApproval);
}    