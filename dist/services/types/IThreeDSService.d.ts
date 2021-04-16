import ValidatePaymentsResponse from "src/domain/validatePaymentResponse";
export default interface IThreeDSService {
    initialiseCardinal(sessionId: string): Promise<ValidatePaymentsResponse>;
    verifyEnrollment(sessionId: string, paymentInstrumentId: string): Promise<ValidatePaymentsResponse>;
}
