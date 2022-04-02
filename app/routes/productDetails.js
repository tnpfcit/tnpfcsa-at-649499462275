module.exports = function(app) {
	   
    const productdetails = require('../controllers/productDetails.js');
    app.post('/tnpfc/v1/getProductDetails', productdetails.productDetails);
}