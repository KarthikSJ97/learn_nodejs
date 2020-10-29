const winston = require('winston');
require('winston-mongodb');
// Require express-async-errors to handle exceptions globally and pass the control to error.js middleware
require('express-async-errors');

module.exports = function() {

    const console = new winston.transports.Console({ colorize: true, prettyPrint: true});
    // Creating a logger object
    winston.createLogger({
        transports: [
            // Adding the console transport
            winston.add(console),
            // Adding the file transport to store the logs in file
            winston.add(new winston.transports.File({ filename: '../logfile.log' })),
            winston.add(new winston.transports.MongoDB({
                db: 'mongodb://localhost/vidly',
                level: 'info'
            })),
            // To handle uncaught exception outside the request handling pipeline
            winston.add(
                new winston.transports.File({
                filename: '../uncaughtExceptions.log',
                handleExceptions: true
                }),
                console
                // new winston.transports.Console({ colorize: true, prettyPrint: true})
            ),
            // To handle Unhandled Promise Rejections outside the request handling pipeline
            winston.add(new winston.transports.File({
                filename: '../unhandledRejections.log',
                handleRejections: true
                }),
                console
                // new winston.transports.Console({ colorize: true, prettyPrint: true})
            )
        ]
    });
}