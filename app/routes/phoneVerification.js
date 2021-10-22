// export default function(app) {
	   
//       const phoneNumber = require('../controllers/phoneVerification.js');
//       app.post('/tnpfc/v1/registerPhoneNumber', phoneNumber.phoneRegister);
// }

module.exports = function(app) {
	   
    const phoneNumber = require('../controllers/phoneVerification.js');
    app.post('/tnpfc/v1/registerPhoneNumber', phoneNumber.phoneRegister);
}