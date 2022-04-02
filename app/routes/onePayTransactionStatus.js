module.exports = function(app) {
    
    const status = require('../controllers/onePayTransactionStatus.js');
    app.post('/tnpfc/v1/transactionStatus',status.transactionStatus);
}