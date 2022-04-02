const db = require('../config/db.js');
const sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');
var jwt=require('jsonwebtoken');
var moment = require('moment');
var ootp = db.otpgeneration;
var ootps = db.otpgeneration;

// Get access token.

module.exports.getAccessToken = function (bearerToken) {
  return new Promise((resolve) => {
    db.sequelize.query("SELECT access_token as \"acess_token\", access_token_expires_on as \"access_token_expires_on\",\
      client_id as \"client_id\", refresh_token as \"refresh_token\", refresh_token_expires_on as \"refresh_token_expires_on\",\
      user_id as \"user_id\" FROM oauth_tokens WHERE access_token=:bearerToken",
      {replacements: {bearerToken:bearerToken},type: sequelize.QueryTypes.SELECT}
    ).then(results => {
      if (results === undefined || results.length == 0) {
        resolve(false);
      }
      else {
        var token = results[0];
        var accessTokenExpiresOnObj = new Date(+token.access_token_expires_on);
        var refreshTokenExpiresOnObj = new Date(+token.refresh_token_expires_on);
        var tokenResult = {
          accessToken: token.access_token,
          accessTokenExpiresAt: accessTokenExpiresOnObj,
          clientId: token.client_id,
          refreshToken: token.refresh_token,
          refreshTokenExpiresAt: refreshTokenExpiresOnObj,
          userId: token.user_id,
          client: { id: token.client_id },
          user: { id: token.user_id },
          scope: null,
        };
        resolve(tokenResult);
      }
    }).catch(err => {resolve(null);});});
}

// Get refresh token.

module.exports.getRefreshToken = function (bearerToken) {
  return new Promise((resolve) => {
    db.sequelize.query("SELECT access_token as \"access_token\", access_token_expires_on as \"access_token_expires_on\", client_id as \"client_id\", refresh_token as \"refresh_token\", refresh_token_expires_on as \"refresh_token_expires_on\", user_id as \"user_id\" FROM oauth_tokens WHERE refresh_token=:bearerToken",
      { replacements: { bearerToken: bearerToken }, type: sequelize.QueryTypes.SELECT }
    ).then(results => {
      if (results === undefined || results.length == 0) {
        resolve(false);
      }
      var token = results[0];
      if (token == null) {
        resolve(false);
      }
      var accessTokenExpiresOnObj = new Date(+token.access_token_expires_on);
      var refreshTokenExpiresOnObj = new Date(+token.refresh_token_expires_on);
      var tokenResult = {
        accessToken: token.access_token,
        accessTokenExpiresAt: accessTokenExpiresOnObj,
        clientId: token.client_id,
        refreshToken: token.refresh_token,
        refreshTokenExpiresAt: refreshTokenExpiresOnObj,
        userId: token.user_id,
        client: { clientId: token.client_id },
        user: token.user_id,
        scope: null,
      };
      resolve(tokenResult);
    }).catch(err => {
      console.log(err);
      resolve(null);
    });
  });
};

// Get client

module.exports.getClient = function (clientId, clientSecret) {
  return new Promise((resolve) => {
    db.sequelize.query("select client_id, client_secret from oauth_clients where client_id=:clientId and client_secret=:clientSecret",
      { replacements: { clientId: clientId, clientSecret: clientSecret }, type: sequelize.QueryTypes.SELECT }
    ).then(results => {
      if (results === undefined || results.length == 0) {
        resolve(false);
      }
      var oAuthClient = results;
      if (!oAuthClient.length) {
        console.log("null");
        resolve(null);
      }
      resolve({
        clientId: results[0].CLIENT_ID,
        clientSecret: results[0].CLIENT_SECRET,
        redirectUris: [''],
        grants: ['client_credentials', 'password', 'refresh_token']
      });
    }).catch(err => {
      console.log(err);
      resolve(null);
    });
  });
};

// Save token.

module.exports.saveToken = function (token, client, customerId) {
  return new Promise((resolve) => {
    var newToken = {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      user: customerId,
    };
    var id = uuidv4();
    var dateObjAccessToken = new Date(token.accessTokenExpiresAt);
    var dateObjRefreshToken = new Date(token.refreshTokenExpiresAt);
    var sendResponse = {
      "accessToken": newToken,
      "accessTokenExpiresAt":dateObjAccessToken,
      "user": customerId,
      "client": client.clientId,
      "sucesscode":"200"
    }
	var currDate = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
    //var currDate = new Date();
    console.log("============current date and time"+currDate);

    // save to db.
    db.sequelize.query("INSERT INTO oauth_tokens (id,access_token,access_token_expires_on,client_id, refresh_token, refresh_token_expires_on, user_id,log_in) VALUES('" + id + "','" + token.accessToken + "','" + dateObjAccessToken.getTime() + "','" + client.clientId + "','" + token.refreshToken + "','" + dateObjRefreshToken.getTime() + "','" + customerId + "','" + currDate + "')").then(() => {
      resolve(sendResponse);
    }).catch(err => {
      console.log(err);
      resolve(null);
    });
  });
};

// getUser

module.exports.getUser = function (username, password) {
  if (isNaN(username)){
    return new Promise((resolve) => {
		username = username.toUpperCase();
		console.log("username==========="+ username);
      db.sequelize.query("select API_generation(:password, :username)as seconds from dual where dummy = 'X'",{replacements: {password: password, username: username}}
      ).then(results=>{
          var result = results[0][0].SECONDS;
              if(result == null) {
                resolve(false);
              } else if (result > 300) {
                resolve(false);
              } else {
                  ootp.update({ STATUS:'CLOSED'},{ where: { PAN_NUMBER : username}}
                  ).then(results =>{
                    var query = 'select c.cust_id from customer c left join cust_phone cp on c.cust_id = cp.cust_id and phone_type_id = \'MOBILE\' where (pan_number =:username or tan_no =:username) AND NOT EXISTS(SELECT * FROM CUSTOMER_SUSPENDED CS WHERE C.CUST_ID = CS.CUST_ID and cs.status=\'SUSPENDED\') AND C.AUTHORIZE_STATUS = \'AUTHORIZED\' AND (CUSTOMER_STATUS !=\'DECEASED\' OR CUSTOMER_STATUS IS NULL)';
                    db.sequelize.query(query,{replacements:{username:username},type: sequelize.QueryTypes.SELECT}
                    ).then(results=>{
                        var customerId = results[0].CUST_ID;
                        resolve(customerId);
                    }).catch(err => {
                      console.log(err);
                    });
                  }).catch(err => {
                    console.log(err);
                  });
              }
      }).catch(err => {
        console.log(err);
      });
    });
  } else {
    return new Promise((resolve) => {
      db.sequelize.query('SELECT TRUNC(difference * 24*60*60) as DIFF FROM ( SELECT sysdate - (select max(created_date) from API_OTPGENERATION where phone_number =:username and otp =:password and pan_number is null and cust_id is null)  AS difference FROM DUAL where dummy = \'X\')',
        {replacements: {password: password, username: username},type: sequelize.QueryTypes.SELECT}).then(results=>{
          var result = results[0].DIFF;
            if(result == null) {
                   resolve(false); 
            } else if (result > 300) {
                  resolve(false); 
            } else {
                ootps.update({ STATUS:'CLOSED'},{ where: { PHONE_NUMBER : username}}).then(results =>{
                    var customerId = "Your Phone number is successfully Verified";
                    resolve(customerId);
                }).catch(err => {console.log(err)});
            }
      }).catch(err => {
        console.log(err);
      });
    });
  }
}

// Revoke Token.

module.exports.revokeToken = function revokeToken(token) {
  return new Promise((resolve) => {
    var refreshToken = token.refreshToken;
    db.sequelize.query("DELETE FROM oauth_tokens WHERE refresh_token=:refreshToken",
      {replacements:{refreshToken: refreshToken },type: sequelize.QueryTypes.DELETE }
    ).then(() => {
      resolve(true);
    }).catch(err => {resolve(false);});});
}

module.exports.getUserFromClient = function () {
  return "test_getUserFromclient";
}

module.exports.saveAuthorizationCode = function () {
  console.log('how is this implemented!?', arguments);
}
