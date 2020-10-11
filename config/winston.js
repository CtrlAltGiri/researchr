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
        info => `${info.level}: ${info.message}`
    )
)

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
    levels:{
        nuclear: 0, // fatal
        tank: 1,    // error
        soldier: 2, // warn 
        ant: 3,     // info - ants can bite
        atom: 4,    // debug - don't really bother
        quark: 5,    // idek
        error: 6
    },
    format: logFormat,
    transports: [
        new winstonDailyRotate({
            filename: `${appRoot}/logs/infoLogs-%DATE%.log`,
            datePattern: 'DD-MM-YYYY',
            level: 'ant',
            json: true,
            maxsize: 5242880,
            maxFiles: 5,
            handleExceptions: true
        }),
        new winstonDailyRotate({
            filename: `${appRoot}/logs/errorLogs-%DATE%.log`,
            datePattern: 'DD-MM-YYYY',
            level: 'tank',
            json: true,
            maxsize: 5242880,
            maxFiles: 5,
            handleExceptions: true
        }),  
        new winston.transports.Console({
          level: 'ant'
        })
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// if(process.env.NODE_ENV !== 'production'){
//   logger.add(new winston.transports.Console({
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.simple()
//     )
//   }));
// }

winston.addColors({
    nuclear: 'red', // fatal
    tank: 'orange',    // error
    soldier: 'yellow', // warn
    ant: 'green',     // info - ants can bite
    atom: 'blue',    // debug - don't really bother
    quark: 'white'    // silly
})

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    logger.ant(message);
  },
};

module.exports = logger;