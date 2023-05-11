var express = require('express');
var moment = require('moment');
var app = express();
var router=express.Router();
var https = require('https');
var fs = require('fs');
var cors = require('cors');
var morgan = require('morgan');
var jwt=require('jsonwebtoken');
var appRoot = require('app-root-path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const pdf2base64 = require('pdf-to-base64');
var OAuthServer = require('express-oauth-server');
var winston = require('winston');
const db = require('./app/config/db.js');
var device = require('express-device');
var logger = require('./app/config/logger.js');
var async = require("async");
const { v4: uuidv4 } = require('uuid');
var java = require('java'); //after this
java.options.push("-Djava.awt.headless=true");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(device.capture());
app.use(cors({ origin:true, credentials:true }));




app.oauth = new OAuthServer({
    model: require('./app/helpers/tokenFile.js'), 
    accessTokenLifetime: 60*10, 
    alwaysIssueNewRefreshToken: true,
    refreshTokenLifetime: 60*30,
    requireClientAuthentication: false
});


 // cors
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
     next();
  });
  
// Session Token Api 
app.post('/tnpfc/v1/oauth/token', app.oauth.token());

//routes
require('./app/routes/routes.js')(app);


//jasper report
jasper = require('node-jasper')({
    path: 'D:\\Reports\\jasperreports-5.6.0-project\\jasperreports-5.6.0',
    reports: {
			hw: {
				jasper: 'D:/Reports/interest_Certificate2122.jasper'
			
			}
    },
	drivers: {
            oracle: {
                path: 'D:/Reports/lib/ojdbc6.jar',
				class: 'oracle.jdbc.OracleDriver',
                type: 'oracle'
            }
    },
    conns: {
            dbserver1: {
                host: '',
                port: 1521,
                dbname: 'CBMS',
                user: '',
                pass: '',
				driver: {
					type: 'oracle:thin'
				}
            }
	},
    defaultConn: 'dbserver1'
});

app.post('/tnpfc/v1/interestReport', function(req, res, next) {
    
    let fileName = uuidv4();
    let path = 'D:/int_certificate/' + fileName + '.pdf';
    let panNumber = req.body.panNumber; 
    let report = {
        report: 'hw',
	    data: {
				PANNUM:panNumber,
				//imageDir:'http://3.6.140.141:8091/cbms/',
				imageDir:'https://tnpfc-dms.s3.ap-south-1.amazonaws.com/ReportImages/',
				USER_ID:'fd1'
        }
    };
	
	async function operation() {
		return new Promise(function(resolve, reject) {
			
			var pdf = jasper.pdf(report);
			res.set({
				'Content-type': 'application/pdf',
				'Content-Length': pdf.length
			});
		
			fs.writeFile(path, pdf, function(err, result) {
				if(err){
					console.log("this is pdf error"+err);
					resolve("failure");
				} else {
					resolve("sucess");
				}
				//defaultConn.end();
			});	
		}).catch((err) => {
			console.log(err)
		});
	}

async function app() {
    
	var a = await operation();
		if(a == "sucess"){
			pdf2base64(path).then(response => {
				if(response){
					fs.unlink(path, (err) => {
						if (err) {
							console.error(err)
						}
					});
			
					return res.status(200).send({
						"responseCode":"200",
						"response":response
					});
					
				} else {
					return res.status(200).send({
						"responseCode":"404",
						"response":"No generated"
					});
				}	
			}).catch(err => {
				console.log(err);
			});
		} else {
			return res.status(200).send({
				"responseCode":"404",
				"response":"No pdf is generated"
			});
		}
}
	app();
	//dbserver1.release();
   	
});

// server creation
 var server = app.listen(3001, function(){
  var host = server.address().address
 var port = server.address().port
 console.log("App listening at http://%s:%s", host, port)
});