import ValidatePaymentsResponse from "src/domain/validatePaymentResponse";
import IElementsService from "./types/IElementsService";
import IHttpService from "./types/IHttpService";
import ILoggingService from "./types/ILoggingService";
export default class ThreeDSService {
    private authToken;
    private apiBase;
    private apiKey;
    private httpService;
    private logger;
    constructor(authToken: string, apiBase: string, apiKey: string, httpService: IHttpService, elementsService: IElementsService, logger: ILoggingService);
    private gatewayServiceBaseURL;
    private walletId;
    private initialiseCardinal;
    verifyEnrollment(sessionId: string, paymentInstrumentId: string): Promise<ValidatePaymentsResponse>;
}
