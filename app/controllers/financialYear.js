const db = require('../config/db.js');
const sequelize = require('sequelize');
var logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,badRequestcode,NoRecords} = require('../config/env');

exports.financialyear = (req, res, err) => {
    logger.info(`
      ${new Date()} || 
      ${req.originalUrl} || 
      ${JSON.stringify(req.body)} || 
      ${req.ip} || 
      ${req.protocol} || 
      ${req.method}
    `);
	var query = 'SELECT API_GETFINYEAR(-4) "fin" FROM DUAL\
		UNION\
		SELECT API_GETFINYEAR(-3) "fin" FROM DUAL\
		UNION \
		SELECT API_GETFINYEAR(-2) "fin" FROM DUAL\
		UNION\
		SELECT API_GETFINYEAR(-1) as "fin" FROM DUAL \
		UNION \
		SELECT API_GETFINYEAR(0) "fin" FROM DUAL'; 
	db.sequelize.query(query,{type: sequelize.QueryTypes.SELECT}
	).then(results => {
		if(results.length > 0){
			return res.status(200).send({
            "responseCode":sucessCode,
            "response":[{fyCode:results[0].fin, fyYear:results[0].fin},{ fyCode:results[1].fin,fyYear:results[1].fin},
			{ fyCode:results[2].fin,fyYear:results[2].fin},{ fyCode:results[3].fin,fyYear:results[3].fin},{ fyCode:results[4].fin,fyYear:results[4].fin}]
			});
		} else {
			return res.status(200).send({
			"responseCode":resourceNotFoundcode,
			"response":NoRecords
			}); 
		}
	}).catch(err => {
		return res.status(500).send({
		data:null,
		message: err.message
		});
	});
}