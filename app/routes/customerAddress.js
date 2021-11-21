module.exports = function(app) {
	   
    const customeraddress = require('../controllers/customerAddress.js');
    
    //cities 
    app.post('/tnpfc/v1/cities', customeraddress.city);
    //state
    app.post('/tnpfc/v1/states', customeraddress.state);
    //country
    app.post('/tnpfc/v1/countries', customeraddress.country);
	//country
    app.post('/tnpfc/v1/districts', customeraddress.districts);
	//pay frequency
	app.post('/tnpfc/v1/getIntPayFrequency', customeraddress.master);
	//pincode-master
	app.post('/tnpfc/v1/getLocationList',customeraddress.locationList);
	//title
    app.post('/tnpfc/v1/getTitleList',customeraddress.title);
    //residential-status
    app.post('/tnpfc/v1/getResidentList',customeraddress.residentialStatus);
}