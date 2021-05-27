import { LogLevel } from './log-level';
import { formatString } from '../utils/format-string';

export abstract class Logger {
    protected next: Logger | null = null;
    protected labelTemplate = '[%s]';
    constructor(
        protected level: LogLevel
    ) { }

    setNext(next: Logger): Logger {
        let logger: Logger | null = this;
        while (logger.next) {
            logger = logger.next;
        }
        logger.next = next;
        return this;
    }

    debug({ message = '', label = '' }: { message?: string, label?: string }, ...params: any[]): void {
        message = this.format(message, label, params);
        this.write(LogLevel.debug, message);
    }

    info({ message = '', label = '' }: { message?: string, label?: string }, ...params: any[]): void {
        message = this.format(message, label, params);
        this.write(LogLevel.info, message);
    }

    warn({ message = '', label = '' }: { message?: string, label?: string }, ...params: any[]): void {
        message = this.format(message, label, params);
        this.write(LogLevel.warn, message);
    }

    error({ message = '', label = '' }: { message?: string, label?: string }, ...params: any[]): void {
        message = this.format(message, label, params);
        this.write(LogLevel.error, message);
    }

    protected format(message: string, label: string, params: any[]) {
        message = formatString(message, ...params);
        if (label) {
            message = formatString(this.labelTemplate, label, message);
        }
        return message;
    }

    protected write(level: LogLevel, message: string) {
        this.log(level, message);
        if (this.next) {
            this.next.write(level, message);
        }
    }

    protected abstract log(level: LogLevel, message: string): void;
}