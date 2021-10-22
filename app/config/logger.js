const appRoot = require('app-root-path');
const winston = require('winston');

var options = {
  file: {
    level: 'silly',
    filename: `${appRoot}/logs/app.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 520,
    colorize: false,
  }
};

// instantiate a new Winston Logger with the settings defined above
let logger = winston.createLogger({
  level: 'silly',
  format: winston.format.simple(),
  transports: [
    //new winston.transports.File({ filename: 'app.log'}),
     new winston.transports.File(options.file),
],
exitOnError: false,
});

module.exports = logger;