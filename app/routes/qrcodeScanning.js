module.exports = function(app) {
    
    const qrcodescanning = require('../controllers/qrcodeScanning.js');
    app.post('/tnpfc/v1/getQrCodeUrl', qrcodescanning.qrInformation);
}