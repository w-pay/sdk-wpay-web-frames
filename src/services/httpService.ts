import { injectable, inject } from 'inversify';
import { ServiceTypes } from '.';
import ILoggingService from './types/ILoggingService';
import IHttpService from './types/IHttpService';
import { LogLevel } from '../domain/logLevel';
import * as Axios from 'axios';

@injectable()
export default class HttpService implements IHttpService {
    private logger!: ILoggingService;
    
    constructor(@inject(ServiceTypes.LoggingService) logger: ILoggingService) {
        this.logger = logger;
    }

    public async fetch(url:string, options: any): Promise<Axios.AxiosResponse> {
        try {
            return await Axios.default(url, options);
        } catch (ex) {
            this.logger.log(ex, LogLevel.DEBUG);
            throw ex;
        }
    }
}