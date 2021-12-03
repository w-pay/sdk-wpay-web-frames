import ValidatePaymentsResponse from "../../domain/validatePaymentResponse";
import { IAction } from "./IAction";
export default interface IValidatePayment extends IAction {
    start(): Promise<void>;
    complete(): Promise<ValidatePaymentsResponse>;
}
