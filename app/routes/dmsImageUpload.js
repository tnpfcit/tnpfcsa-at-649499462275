module.exports = function(app) {
    const imageupload = require('../controllers/dmsImageUpload.js');
    app.post('/tnpfc/v1/updateDocumentImageLink', imageupload.imageUpload)
   
}