module.exports = function (app) {
    const gmCmdApproval = require('../controllers/approved.js');
    app.post('/tnpfc/v1/depositApproval', gmCmdApproval.approving);
}