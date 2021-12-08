import ValidatePaymentsResponse from "../../domain/validatePaymentResponse";
import { IAction } from "./IAction";
export default interface IValidateCard extends IAction {
    start(): Promise<void>;
    complete(): Promise<ValidatePaymentsResponse>;
}
