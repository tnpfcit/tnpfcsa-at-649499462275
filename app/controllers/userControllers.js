var config = require('../config/config.json');
const db = require('../config/db.js');
const enums = require('../helpers/enums');
const sequelize = require('sequelize');

exports.getUsers = (req, res) => {
    res.send("Okay");
}
exports.getUserByUsername = (req, res) => {
    var username = req.body.username;
    console.log(req.headers.authorization);
    if (username == null) {
        res.status(400).send({ "data": null, "message": "username required" });
    }else{
        // fetching user details from DB.
        db.sequelize.query("select user_id, user_role from user_master where auth_id=:username",
            { replacements: { username: username }, type: sequelize.QueryTypes.SELECT }
        ).then(results => {
            res.status(200).send({ "data": results, "message": "Success" });
        }).catch(err => { res.status(500).send({ data:null, message: err.message }); });
    }
}