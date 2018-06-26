const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'log/error.log', level: 'error'}),
        new winston.transports.File({filename: 'log/combined.log'}),
    ]
});

if(process.env.NODE_ENV !== 'production') {
    console.log('development mode');
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;