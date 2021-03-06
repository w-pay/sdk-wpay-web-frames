import ValidatePaymentsResponse from "../domain/validatePaymentResponse";
import ILoggingService from "./types/ILoggingService";
import IThreeDSService from "./types/IThreeDSService";
import IHttpService from "./types/IHttpService";
export default class ThreeDSService implements IThreeDSService {
    private authToken;
    private apiBase;
    private apiKey;
    private httpService;
    private logger;
    constructor(authToken: string, apiBase: string, apiKey: string, httpService: IHttpService, logger: ILoggingService);
    private walletId;
    initializeCardinal(sessionId: string): Promise<string>;
    verifyEnrollment(sessionId: string, targetElementId: string, paymentInstrumentId?: string, threeDS?: any): Promise<ValidatePaymentsResponse>;
}
