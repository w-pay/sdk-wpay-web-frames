import IElementsService from "../services/types/IElementsService";
import IHttpService from "../services/types/IHttpService";
import ILoggingService from "../services/types/ILoggingService";
import ActionBase from "./actionBase";
import { IAction } from "./types/IAction";
import "cardinal-commerce-songbird-staging";
export default class ValidatePayment extends ActionBase implements IAction {
    private authToken;
    private apiBase;
    private apiKey;
    private httpService;
    constructor(authToken: string, apiBase: string, apiKey: string, httpService: IHttpService, elementsService: IElementsService, logger: ILoggingService);
    private gatewayServiceBaseURL;
    private walletId;
    private cardinalSessionId;
    createElement(elementType: string, targetElement: string, options?: any): void;
    errors(): any[];
    start(): Promise<void>;
    complete(): Promise<unknown>;
    private initialiseCardinal;
    verifyEnrollment(sessionId: string): Promise<unknown>;
}
