module.exports = function(app) {
	   
    const websiteStatics = require('../controllers/websiteStatistics.js');
    app.post('/tnpfc/v1/websiteHpStatistics',websiteStatics.stastics);
}    