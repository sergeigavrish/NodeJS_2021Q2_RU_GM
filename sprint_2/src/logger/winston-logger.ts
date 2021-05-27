import winston from 'winston';
import { LogLevel } from './log-level';
import { Logger } from './logger';

export class WinstonLogger extends Logger {
    constructor(
        level: LogLevel,
        private winstonLogger: winston.Logger
    ) {
        super(level);
    }

    protected log(level: LogLevel, message: string): void {
        if (level < this.level) {
            return;
        }
        switch (level) {
            case LogLevel.debug:
                this.winstonLogger.log('debug', message);
                break;
            case LogLevel.error:
                this.winstonLogger.error(message);
                break;
            case LogLevel.info:
                this.winstonLogger.info(message);
                break;
            case LogLevel.warn:
                this.winstonLogger.warn(message);
                break;
            default:
                break;
        }
    }
}