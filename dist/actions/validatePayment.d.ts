import IElementsService from "../services/types/IElementsService";
import ILoggingService from "../services/types/ILoggingService";
import ActionBase from "./actionBase";
import { IAction } from "./types/IAction";
import "cardinal-commerce-songbird-staging";
import IThreeDSService from "../services/types/IThreeDSService";
export default class ValidatePayment extends ActionBase implements IAction {
    private threeDSService;
    constructor(elementsService: IElementsService, threeDSService: IThreeDSService, logger: ILoggingService);
    createElement(elementType: string, targetElement: string, options?: any): void;
    errors(): any[];
    start(): Promise<void>;
    complete(): Promise<import("../domain/validatePaymentResponse").default>;
}
