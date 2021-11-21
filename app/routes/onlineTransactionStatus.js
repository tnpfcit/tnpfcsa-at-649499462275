module.exports = function(app) {
    const status = require('../controllers/onlineTransactionStatus.js');
    app.post('/tnpfc/v1/getOnlineTransStatus', status.onlineTransaction);
} 