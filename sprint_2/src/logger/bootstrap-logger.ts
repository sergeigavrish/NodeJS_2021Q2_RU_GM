import winston from 'winston';
import { LogLevel } from './log-level';
import { Logger } from './logger'
import { WinstonLogger } from './winston-logger';

export let logger: Logger;

export function bootstrapLogger() {
    logger = new WinstonLogger(
        LogLevel.error,
        winston.createLogger({
            transports: [
                new winston.transports.File({
                    level: 'error',
                    filename: './logs/error.log',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.printf(({ level, message, timestamp }) => {
                            return `${timestamp} ${level}: ${message}`;
                        })
                    )
                })
            ]
        })
    );
    logger.setNext(
        new WinstonLogger(
            LogLevel.debug,
            winston.createLogger({
                transports: [
                    new winston.transports.Console({
                        level: 'debug',
                        handleExceptions: true,
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.colorize(),
                            winston.format.simple(),
                            winston.format.printf(({ level, message, timestamp }) => {
                                return `${timestamp} ${level}: ${message}`;
                            })
                        )
                    }),
                    new winston.transports.File({
                        level: 'debug',
                        filename: './logs/debug.log',
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.printf(({ level, message, timestamp }) => {
                                return `${timestamp} ${level}: ${message}`;
                            })
                        )
                    })
                ]
            })
        )
    );
}