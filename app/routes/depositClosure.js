module.exports = function(app) {
	   
    const depositClosure = require('../controllers/depositClosure.js');
    //const depositClosureValidation = require('../middleware/depositClosureValidation.js');
    app.post('/tnpfc/v1/depositClosure', app.oauth.authenticate(), depositClosure.depositclosure);
    //app.post('/tnpfc/v1/depositClosure',depositClosureValidation.validates('depositClosure'),depositClosure.depositclosure);
}