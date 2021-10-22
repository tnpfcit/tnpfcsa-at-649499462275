module.exports = function(app) {
    
    const qrcodescanningresponse = require('../controllers/qrcodeScanningResponse.js');
    app.get('/tnpfc/v1/getQRData', qrcodescanningresponse.qrresponseInformation);
}