import ValidatePaymentsResponse from "src/domain/validatePaymentResponse";
export default interface IThreeDSService {
    initializeCardinal(sessionId: string, targetElementId: string): Promise<string>;
    verifyEnrollment(sessionId: string, targetElementId: string, paymentInstrumentId?: string, threeDS?: any): Promise<ValidatePaymentsResponse>;
}
