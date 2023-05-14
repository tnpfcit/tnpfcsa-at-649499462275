module.exports = function(app) {
    
    const customerdetails = require('../controllers/customerDetails.js');
    app.post('/tnpfc/ipad/getCustomerDetails',authController.verifyToken,customerdetails.customerInformation);
    //app.post('/tnpfc/v1/getCustomerDetails',customerdetails.customerInformation);
}