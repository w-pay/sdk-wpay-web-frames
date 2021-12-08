import ActionBase from "./actionBase";
import IThreeDSService from "../services/types/IThreeDSService";
import ILoggingService from "../services/types/ILoggingService";
import IFramesService from "../services/types/IFramesService";
import IValidateCard from "./types/IValidateCard";
import ValidatePaymentsResponse from "src/domain/validatePaymentResponse";
export default class ValidateCard extends ActionBase implements IValidateCard {
    private threeDSService;
    constructor(framesService: IFramesService, threeDSService: IThreeDSService, logger: ILoggingService);
    createFramesControl(framesControlType: string, targetElementId: string, options?: any): void;
    errors(): any[];
    start(): Promise<void>;
    complete(): Promise<ValidatePaymentsResponse>;
}
