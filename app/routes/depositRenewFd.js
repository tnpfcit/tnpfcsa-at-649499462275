module.exports = function(app) {
	   
    const depositRenewFd = require('../controllers/depositRenewFd.js');
    //app.post('/tnpfc/v1/depositRenewFd',app.oauth.authenticate(),depositRenewFd.depositRenewFd);
    app.post('/tnpfc/v1/depositRenewFd',app.oauth.authenticate(),depositRenewFd.depositRenewFd);
	app.post('/tnpfc/v1/depositRenew',app.oauth.authenticate(),depositRenewFd.depositRenewFd1);
    
}