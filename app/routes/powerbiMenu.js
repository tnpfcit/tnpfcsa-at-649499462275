module.exports = function(app) {
    
    const getMenus = require('../controllers/powerbiMenu.js');
    app.get('/tnpfc/v1/getDashboardMenuItems', getMenus.powerbiMenu);
}