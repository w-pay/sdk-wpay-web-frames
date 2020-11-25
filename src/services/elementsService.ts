import IActionResponse from 'src/actions/types/IActionResponse';
import { injectable, inject } from 'inversify';
import IElementsService from './types/IElementsService';
import { ServiceTypes } from '.';
import ILoggingService from './types/ILoggingService';
import IHttpService from './types/IHttpService';
import { AxiosResponse } from 'axios';

@injectable()
export default class ElementsService implements IElementsService {
    private apiBase!: string;
    private httpService!: IHttpService;
    private authToken!: string;
    private apiKey!: string;

    constructor(
        @inject("authToken") authToken: string,
        @inject("apiBase") apiBase: string,
        @inject("apiKey") apiKey: string,
        @inject(ServiceTypes.HttpService) httpService: IHttpService
    ) {
        this.apiBase = apiBase;
        this.authToken = authToken;
        this.apiKey = apiKey;
        this.httpService = httpService;
    }

    public async initialiseAction(actionType: string, useEverdayPay: boolean = false): Promise<IActionResponse> {

        const response: AxiosResponse = await this.httpService.fetch(`${this.apiBase}/customer/elements/${actionType}/init`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.authToken,
                'x-api-key': this.apiKey,
                'x-wallet-id': '4fa9e893-2fb9-4516-bfc5-6fa8cd903528',
                'x-everyday-pay-wallet': useEverdayPay
            }
        });

        let responseData = await response.data;
        return responseData.data;
    }

    public async completeAction(actionType: string, sessionId: string, actionId: string): Promise<void> {
        const response: AxiosResponse = await this.httpService.fetch(`${this.apiBase}/customer/elements/${actionType}/${actionId}/complete`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.authToken,
                'x-api-key': this.apiKey,
                'x-session-id': sessionId,
                'x-wallet-id': '4fa9e893-2fb9-4516-bfc5-6fa8cd903528',
            }
        });

        let responseData = await response.data;

        return responseData;
    }
}