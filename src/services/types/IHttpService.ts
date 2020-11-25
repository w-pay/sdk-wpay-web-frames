import { AxiosResponse } from 'axios';

export default interface IHttpService {
    fetch(url: string, options: any): Promise<AxiosResponse>;
}