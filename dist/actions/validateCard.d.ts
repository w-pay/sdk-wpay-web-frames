import ActionBase from "./actionBase";
import { IAction } from "./types/IAction";
import IThreeDSService from "../services/types/IThreeDSService";
import ILoggingService from "../services/types/ILoggingService";
import IFramesService from "../services/types/IFramesService";
export default class ValidateCard extends ActionBase implements IAction {
    private threeDSService;
    constructor(framesService: IFramesService, threeDSService: IThreeDSService, logger: ILoggingService);
    createFramesControl(framesControlType: string, targetElement: string, options?: any): void;
    errors(): any[];
    start(): Promise<void>;
    complete(): Promise<import("../domain/validatePaymentResponse").default>;
}
