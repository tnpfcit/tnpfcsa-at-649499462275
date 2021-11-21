module.exports = function(app) {
    const depositcreation = require('../controllers/depositCreation.js');
   
    app.post('/tnpfc/v1/depositCreation', depositcreation.creation);
}