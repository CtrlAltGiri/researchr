var appRoot = require('app-root-path');
var winston = require('winston');
var winstonDailyRotate = require('winston-daily-rotate-file');

var logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss'
    }),
    winston.format.errors({stack: true}),
    winston.format.splat(),
    winston.format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}`
    )
)

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
    format: logFormat,
    transports: [
        new winstonDailyRotate({
            filename: `${appRoot}/logs/infoLogs-%DATE%.log`,
            datePattern: 'DD-MM-YYYY',
            level: 'info',
            json: true,
            maxsize: 5242880,
            maxFiles: 5,
            handleExceptions: true
        }),
        new winstonDailyRotate({
            filename: `${appRoot}/logs/errorLogs-%DATE%.log`,
            datePattern: 'DD-MM-YYYY',
            level: 'error',
            json: true,
            maxsize: 5242880,
            maxFiles: 5,
            handleExceptions: true
        }),
    ],
    exitOnError: false, // do not exit on handled exceptions
});

if(process.env.NODE_ENV !== 'production'){
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;