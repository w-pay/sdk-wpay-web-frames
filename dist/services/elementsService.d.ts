import IActionResponse from 'src/actions/types/IActionResponse';
import IElementsService from './types/IElementsService';
import IHttpService from './types/IHttpService';
export default class ElementsService implements IElementsService {
    private apiBase;
    private httpService;
    private authToken;
    private apiKey;
    constructor(authToken: string, apiBase: string, apiKey: string, httpService: IHttpService);
    initialiseAction(actionType: string, useEverdayPay: boolean | undefined, props: any): Promise<IActionResponse>;
    completeAction(actionType: string, sessionId: string, actionId: string): Promise<void>;
}
