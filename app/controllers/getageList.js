const db = require('../config/db.js');
const sequelize = require('sequelize');
const logger = require('../config/logger.js');


exports.agelist = (req,res) =>{
db.sequelize.query('select MINOR_AGE,RETIREMENT_AGE,SUPER_SR_CITIZEN_AGE FROM PARAMETERS', { type: sequelize.QueryTypes.SELECT}).then(results=>{
    console.log(results);
    if(results)
    {
        return res.status(200).send({"message": "ok","responseCode":"200","response":results});
    }
    else{
      res.send({"responseCode":"404","message": " age resource not found"});
    }
    }).catch(err => {
        res.status(500).send({
            message: err.message
        })
    });
}



   