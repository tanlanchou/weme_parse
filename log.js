const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

// 定义日志格式
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// 配置Winston日志，使用文件传输器
const logger = winston.createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' }),
    ],
});

module.exports = logger;