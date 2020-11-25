import ILoggingService from './types/ILoggingService';
import IHttpService from './types/IHttpService';
import * as Axios from 'axios';
export default class HttpService implements IHttpService {
    private logger;
    constructor(logger: ILoggingService);
    fetch(url: string, options: any): Promise<Axios.AxiosResponse>;
}
