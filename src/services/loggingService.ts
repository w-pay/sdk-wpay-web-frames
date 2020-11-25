import ILoggingService from './types/ILoggingService';
import { injectable, inject } from 'inversify';
import { LogLevel } from '../domain/logLevel';

@injectable()
export default class LoggingService implements ILoggingService {
    private logLevel: LogLevel = LogLevel.NONE;

    constructor(@inject("logLevel") logLevel: LogLevel) {
        if (logLevel) this.logLevel = logLevel;
    }

    public getLevel(): LogLevel {
        return this.logLevel;
    }

    public log(message: string, level: LogLevel): void {
        if (level <= this.logLevel) {
            console.log(message);
        }
    }
}