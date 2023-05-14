module.exports = function(app) {
	   
    const depositClosure = require('../controllers/depositClosure.js');
    app.post('/tnpfc/v1/depositClosure',app.oauth.authenticate(),depositClosure.depositclosure);
    //app.post('/tnpfc/v1/depositClosure',depositClosure.depositclosure);
    
}