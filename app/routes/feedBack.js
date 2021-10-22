module.exports = function(app) {
	   
    const clientfeedback = require('../controllers/feedBack.js');
    app.post('/tnpfc/v1/customerFeedback',clientfeedback.feedBack);
	
}