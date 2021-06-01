import ValidatePaymentsResponse from "../domain/validatePaymentResponse";
import ILoggingService from "./types/ILoggingService";
import IThreeDSService from "./types/IThreeDSService";
export default class ThreeDSService implements IThreeDSService {
    private authToken;
    private apiBase;
    private apiKey;
    private logger;
    constructor(authToken: string, apiBase: string, apiKey: string, logger: ILoggingService);
    private walletId;
    initializeCardinal(sessionId: string): Promise<string>;
    verifyEnrollment(sessionId: string, paymentInstrumentId: string, threeDS?: any): Promise<ValidatePaymentsResponse>;
}
