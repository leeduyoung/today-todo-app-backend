const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const moment = require('moment');
const { format } = require('winston');
const { combine, timestamp, label, printf } = format;
const logDir = 'logs';


if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const customFormat = printf(info => {
  return `${moment().format('YYYY-MM-DD HH:mm:ss')} [${info.label}] ${info.level}: ${info.message}`;
});

const dailyRotate = new DailyRotateFile({
    filename: `${logDir}/%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d'
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        label({ label: '오늘할일' }),
        customFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: `${logDir}/combined.log`, maxsize: 100000000, maxFiles: 5}),
        new winston.transports.File({filename: `${logDir}/error.log`, level: 'error', maxsize: 100000000, maxFiles: 5}),
        dailyRotate,
    ]
});

if(process.env.NODE_ENV !== 'production') {
    console.log('development mode');
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;