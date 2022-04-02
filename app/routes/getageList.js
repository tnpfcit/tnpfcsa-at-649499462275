module.exports = function(app) {
	   
    const agelist = require('../controllers/getageList.js');
    app.post('/tnpfc/v1/getageList', agelist.agelist);
}