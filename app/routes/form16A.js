module.exports = function(app) {
	   
    const form16 = require('../controllers/form16A.js');
    //app.post('/tnpfc/v1/getForm16Document',app.oauth.authenticate(),form16.form16A);
    app.post('/tnpfc/v1/getForm16Document',form16.form16A);
}    