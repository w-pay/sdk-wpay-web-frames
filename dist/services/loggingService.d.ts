import ILoggingService from './types/ILoggingService';
import { LogLevel } from '../domain/logLevel';
export default class LoggingService implements ILoggingService {
    private logLevel;
    constructor(logLevel: LogLevel);
    getLevel(): LogLevel;
    log(message: string, level: LogLevel): void;
}
