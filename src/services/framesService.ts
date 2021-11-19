import IActionResponse from '../actions/types/IActionResponse';
import { injectable, inject } from 'inversify';
import IElementsService from './types/IFramesService';
import { ServiceTypes } from '.';
import IHttpService from './types/IHttpService';
import { AxiosResponse } from 'axios';

@injectable()
export default class FramesService implements IElementsService {
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

    public async initialiseAction(actionType: string, props: any): Promise<IActionResponse> {

        const response: AxiosResponse = await this.httpService.fetch(`${this.apiBase}/customer/elements/${actionType}/init`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.authToken,
                'x-api-key': this.apiKey,
                'x-everyday-pay-wallet': props.useEverydayPay,
                'x-wallet-id': props.walletId
            },
            data: {
                data: {
                    ...props
                }
            }
        });

        let responseData = await response.data;
        return responseData.data;
    }

    public async completeAction(actionType: string, sessionId: string, actionId: string, props: any, challengeResponses: any[]): Promise<any> {
        const response: AxiosResponse = await this.httpService.fetch(`${this.apiBase}/customer/elements/${actionType}/${actionId}/complete`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.authToken,
                'x-api-key': this.apiKey,
                'x-session-id': sessionId,
                'x-wallet-id': props.walletId
            },
            data: {
                data: {
                    save: props.save
                },
                meta: {
                    challengeResponses
                }
            }
        });

        let responseData = await response.data.data;
        return responseData;
    }
}