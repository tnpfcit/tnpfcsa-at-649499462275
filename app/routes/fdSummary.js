module.exports = function(app) {
	   
    const fdsummary = require('../controllers/fdSummary.js');
    app.post('/tnpfc/v1/getFdSummary',app.oauth.authenticate(), fdsummary.depositSummary);
}