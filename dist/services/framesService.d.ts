import IActionResponse from '../actions/types/IActionResponse';
import IElementsService from './types/IFramesService';
import IHttpService from './types/IHttpService';
export default class FramesService implements IElementsService {
    private apiBase;
    private httpService;
    private authToken;
    private apiKey;
    constructor(authToken: string, apiBase: string, apiKey: string, httpService: IHttpService);
    initialiseAction(actionType: string, useEverdayPay: boolean | undefined, props: any): Promise<IActionResponse>;
    completeAction(actionType: string, sessionId: string, actionId: string, props: any): Promise<void>;
}
