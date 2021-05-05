import ILoggingService from "../services/types/ILoggingService";
import ActionBase from "./actionBase";
import { IAction } from "./types/IAction";
import "cardinal-commerce-songbird-staging";
import IThreeDSService from "../services/types/IThreeDSService";
import IFramesService from "../services/types/IFramesService";
export default class ValidatePayment extends ActionBase implements IAction {
    private threeDSService;
    constructor(framesService: IFramesService, threeDSService: IThreeDSService, logger: ILoggingService);
    createFramesControl(framesControlType: string, targetElement: string, options?: any): void;
    errors(): any[];
    start(): Promise<void>;
    complete(): Promise<import("../domain/validatePaymentResponse").default>;
}
