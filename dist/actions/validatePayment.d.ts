import ActionBase from "./actionBase";
import IThreeDSService from "../services/types/IThreeDSService";
import ILoggingService from "../services/types/ILoggingService";
import IFramesService from "../services/types/IFramesService";
import IValidatePayment from "./types/IValidatePayment";
export default class ValidatePayment extends ActionBase implements IValidatePayment {
    private threeDSService;
    constructor(framesService: IFramesService, threeDSService: IThreeDSService, logger: ILoggingService);
    createFramesControl(framesControlType: string, targetElementId: string, options?: any): void;
    errors(): any[];
    start(): Promise<void>;
    complete(): Promise<import("../domain/validatePaymentResponse").default>;
}
