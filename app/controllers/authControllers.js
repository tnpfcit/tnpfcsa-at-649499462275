var config = require('../config/config.json');
var adal = require('adal-node');
const db = require('../config/db.js');
const sequelize = require('sequelize');
const Observable = require('rxjs');
var aad = require('azure-ad-jwt');

// Auzure authentication.
exports.azureAuthentication = (req, res) => {

    var username = req.body.username;
    var password = req.body.password;
    var grantType = req.body.grantType;
	console.log(username);
	console.log(password);
	console.log(grantType);

    // Get token.
    var AuthenticationContext = adal.AuthenticationContext;
    var authorityUrl = config.authorityHostUrl + '/' + config.tenant;
    var context = new AuthenticationContext(authorityUrl, true, new adal.MemoryCache());
    var roleId = null;
	var userId = null;
	var rollName = null;
    // context.acquireTokenWithRefreshToken()
    // password grant.
    if (grantType == "password") {
        context.acquireTokenWithUsernamePassword(config.resource, username, password, config.clientId, function (err, response) {
            if (err) {
                return res.status(401).send({ "data": null, "message": "Invalid credentials" });
            } else {
                // fetching user details from DB.
                db.sequelize.query("select user_id as \"userId\", user_role as \"roleId\" from user_master where auth_id=:username",
                    { replacements: { username: username }, type: sequelize.QueryTypes.SELECT }
                ).then(results => {
                    if (results.length > 0) {
                        roleId = results[0].roleId != undefined ? results[0].roleId : null;
						userId = results[0].userId != undefined ? results[0].userId : null;
						rollName = results[0].roleId == 'ROL01' ? 'General Manager':  results[0].roleId == 'ROL02' ? 'Chairman & Managing Director': null;
                    }
                    var tokenResponse = {
                        tokenType: response.tokenType,
                        expiresIn: response.expiresIn,
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                        roleId: roleId,
						userId: userId,
						rollName:rollName
                    };
                    return res.status(200).send(tokenResponse);
                }).catch(err => { res.status(500).send({ data: null, message: err.message }); });
            }
        });
    } else if (grantType == "refreshToken") {
        var refreshToken = req.body.refreshToken;
        if (refreshToken == null || refreshToken == "") {
            res.status(401).send({ data: null, message: "Invalid token" })
        }
        context.acquireTokenWithRefreshToken(refreshToken, config.clientId, config.resource, function (err, response) {
            if (err) {
                return res.status(401).send({ "data": null, "message": "Invalid credentials" });
            }
            var username = response.userId;
            // fetching user details from DB.
            db.sequelize.query("select user_id as \"userId\", user_role as \"roleId\" from user_master where auth_id=:username",
                { replacements: { username: username }, type: sequelize.QueryTypes.SELECT }
            ).then(results => {
                if (results.length > 0) {
                    roleId = results[0].roleId != undefined ? results[0].roleId : null;
					userId = results[0].userId != undefined ? results[0].userId : null;
					rollName = results[0].roleId == 'ROL01' ? 'Company Secretary':  results[0].roleId == 'ROL02' ? 'Chairman & Managing Director': null;
                }
                var tokenResponse = {
                    tokenType: response.tokenType,
                    expiresIn: response.expiresIn,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                    roleId: roleId,
					userId: userId,
					rollName:rollName
					
                };
                return res.status(200).send(tokenResponse);
            }).catch(err => { res.status(500).send({ data: null, message: err.message }); });
        });
    }
    else {
        res.status(400).send({ data: null, message: "Invalid grantType" })
    }
    //     function isTokenExpired(token) {
    //         var decoded = jwt.decode(token);
    //         var isExpired = decoded.exp - Math.floor(Date.now() / 1000) < 0
    //         return isExpired;
    //     }
    //     console.log(isTokenExpired(token));

}

exports.verifyToken = (req, res, next) => {
    var audience = config.resource;
    var tenantId = config.tenant;

    var authorization = req.headers['authorization'];
    if (authorization) {
        var bearer = authorization.split(" ");
        var jwtToken = bearer[0];
        if (jwtToken) {
            aad.verify(jwtToken, { audience: audience, tenantId: tenantId }, function (err, result) {
                if (result) {
                    return next();
                } else {
                    res.status(401).send('That is not a valid token!');
                }
            })
        } else {
            res.status(401).send('No token in header.');
        }
        // return Observable.create((observer) => {
        //     if (authorization) {
        //         var bearer = authorization.split(" ");
        //         var jwtToken = bearer[1];
        //         if (jwtToken) {
        //             aad.verify(jwtToken, {audience: audience, tenantId: tenantId }, function (err, result) {
        //                 if (result) {
        //                     observer.next(true);
        //                 } else {
        //                     res.status(401).send('That is not a valid token!');
        //                 }
        //             })
        //         } else {
        //             res.status(401).send('No token in header.');
        //         }
        //     } else {
        //         res.status(401).send('Missing authorization attribute in header.');
        //     }
    }

}

