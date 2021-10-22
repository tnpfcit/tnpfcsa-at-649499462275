const  {body}  = require('express-validator');
const { validationResult } = require('express-validator');
exports.validate = (method) => {
return[
        body('bankCode', 'bankCode allow only 10 digits check input correctly').exists().isInt().isLength({min: 5, max: 5 }),
      ]
const errors = validationResult(req);
//customervalidation.validate();
if (!errors.isEmpty()) {res.status(422).json({errors: errors.array()});return;}
} 