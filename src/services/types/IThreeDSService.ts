import ValidatePaymentsResponse from "src/domain/validatePaymentResponse";

export default interface IThreeDSService {
    initializeCardinal(sessionId: string): Promise<string>;
    verifyEnrollment(sessionId: string, paymentInstrumentId: string, threeDS?: any): Promise<ValidatePaymentsResponse>;
}