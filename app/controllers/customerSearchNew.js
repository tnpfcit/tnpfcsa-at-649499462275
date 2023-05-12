const db = require('../config/db.js');
const sequelize = require('sequelize');
var moment = require('moment');
var response = require('../config/config.json');
var logger = require('../config/logger');
var {responseMessage,sucessCode,resourceNotFoundcode,NoRecords} = require('../config/env');

exports.searchInformation = (req, res) => {
    
    var {
        searchValue,
        roleId,
		searchType,
    } = req.body;

    logger.info(`
        ${res.StatusCode} || 
        ${new Date()} || 
        ${req.originalUrl} || 
        ${JSON.stringify(req.body)} || 
        ${req.ip} || 
        ${req.protocol} || 
        ${req.method}
    `);

    roleId = roleId ? roleId : null;    
    
	if (searchType =='PAN') {
		console.log("inside pan query ");
		let query='SELECT CUST_ID "custId", \'NAME: \'||UPPER(PKG_CUSTOMER.GETCUSTFULLNAME(CUST_ID,2)) ||\' - DOB:\ \'||NVL(to_char(DOB,\'DD-MON-YYYY\'),\'NA\')||\' - TYPE: \'||GET_CUST_TYPE(CUST_ID)||\' - PAN/TAN: \'||\
		NVL(PAN_NUMBER,TAN_NO)||\' - PHONE: \'||PKG_CUSTOMER.GETPHONENO(CUST_ID) "details" \
		FROM customer WHERE UPPER(nvl(PAN_NUMBER,TAN_NO))= UPPER(:searchquery)'
		
		db.sequelize.query(query,{
					replacements:{
						searchquery:searchValue
					}, type: sequelize.QueryTypes.SELECT}
				).then(results =>{
					console.log("result==="+JSON.stringify(results));
					if(results.length == 0 ){
						return res.status(200).send({
							 "responseCode":sucessCode,
							 "response":results
						  });
					}else {
						return res.status(200).send({
							 "responseCode":sucessCode,
							 "response":results
						  });
					}
				}).catch(err => {
					return res.status(500).send({
						data:null,
						message: err.message
					});
				});
	}else if (searchType =='NAME') {
		console.log("inside name query ");
		let query='SELECT CUST_ID "custId", \'NAME: \'||UPPER(PKG_CUSTOMER.GETCUSTFULLNAME(CUST_ID,2)) ||\' - DOB:\ \'||NVL(to_char(DOB,\'DD-MON-YYYY\'),\'NA\')||\' - TYPE: \'||GET_CUST_TYPE(CUST_ID)||\' - PAN/TAN: \'||\
		NVL(PAN_NUMBER,TAN_NO)||\' - PHONE: \'||PKG_CUSTOMER.GETPHONENO(CUST_ID) "details"\
		FROM customer WHERE UPPER(nvl(fname,COMP_NAME)) LIKE  UPPER(\'%\'||:searchquery||\'%\')'
		
		db.sequelize.query(query,{
					replacements:{
						searchquery:searchValue
					}, type: sequelize.QueryTypes.SELECT}
				).then(results =>{
					if(results.length == 0 ){
						return res.status(200).send({
							 "responseCode":sucessCode,
							 "response":results
						  });
					}else {
						return res.status(200).send({
							 "responseCode":sucessCode,
							 "response":results
						  });
					}
				}).catch(err => {
					return res.status(500).send({
						data:null,
						message: err.message
					});
				});
	}else if (searchType =='CUSTID') {
		console.log("inside CUSTOMER ID query ");
		let query='SELECT CUST_ID "custId", \'NAME: \'||UPPER(PKG_CUSTOMER.GETCUSTFULLNAME(CUST_ID,2)) ||\' - DOB:\ \'||NVL(to_char(DOB,\'DD-MON-YYYY\'),\'NA\')||\' - TYPE: \'||GET_CUST_TYPE(CUST_ID)||\' - PAN/TAN: \'||\
		NVL(PAN_NUMBER,TAN_NO)||\' - PHONE: \'||PKG_CUSTOMER.GETPHONENO(CUST_ID) "details"\
		FROM customer WHERE CUST_ID = UPPER(:searchquery)'
		
		db.sequelize.query(query,{
					replacements:{
						searchquery:searchValue
					}, type: sequelize.QueryTypes.SELECT}
				).then(results =>{
					if(results.length == 0 ){
						return res.status(200).send({
							 "responseCode":sucessCode,
							 "response":results
						  });
					}else {
						return res.status(200).send({
							 "responseCode":sucessCode,
							 "response":results
						  });
					}
				}).catch(err => {
					return res.status(500).send({
						data:null,
						message: err.message
					});
				});
	} else if (searchType =='PHNUMBER'){
		console.log("inside PHNUMBER query ");
		let query='SELECT A.CUST_ID "custId", \'NAME: \'||UPPER(PKG_CUSTOMER.GETCUSTFULLNAME(A.CUST_ID,2)) ||\' - DOB:\ \'||NVL(to_char(DOB,\'DD-MON-YYYY\'),\'NA\')||\' - TYPE: \'||GET_CUST_TYPE(A.CUST_ID)||\' - PAN/TAN: \'||\
		NVL(PAN_NUMBER,TAN_NO)||\' - PHONE: \'||PKG_CUSTOMER.GETPHONENO(A.CUST_ID) "details"\
		FROM CUSTOMER A JOIN CUST_PHONE B ON A.CUST_ID = B.CUST_ID \
		WHERE B.PHONE_NUMBER = UPPER(:searchquery)'
		
		db.sequelize.query(query,{
					replacements:{
						searchquery:searchValue
					}, type: sequelize.QueryTypes.SELECT}
				).then(results =>{
					if(results.length == 0 ){
						return res.status(200).send({
							 "responseCode":sucessCode,
							 "response":results
						  });
					}else {
						return res.status(200).send({
							 "responseCode":sucessCode,
							 "response":results
						  });
					}
				}).catch(err => {
					return res.status(500).send({
						data:null,
						message: err.message
					});
				});
	}else {

        return res.status(200).send({
            "responseCode":404,
            "response":"bad request"
        });

    }
}