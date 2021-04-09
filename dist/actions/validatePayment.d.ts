import IElementsService from "../services/types/IElementsService";
import IHttpService from "../services/types/IHttpService";
import ILoggingService from "../services/types/ILoggingService";
import ActionBase from "./actionBase";
import { IAction } from "./types/IAction";
export default class ValidatePayment extends ActionBase implements IAction {
    private authToken;
    private apiBase;
    private apiKey;
    private httpService;
    constructor(authToken: string, apiBase: string, apiKey: string, httpService: IHttpService, elementsService: IElementsService, logger: ILoggingService);
    createElement(elementType: string, targetElement: string, options?: any): void;
    errors(): any[];
    start(): Promise<void>;
    complete(): void;
    private initialiseCardinal;
}
