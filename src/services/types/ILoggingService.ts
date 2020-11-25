import { LogLevel } from '../../domain/logLevel';

export default interface ILoggingService {
    getLevel(): LogLevel;
    log(message: string, level: LogLevel): void;
}