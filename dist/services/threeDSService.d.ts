import ValidatePaymentsResponse from "../domain/validatePaymentResponse";
import IElementsService from "./types/IElementsService";
import IHttpService from "./types/IHttpService";
import ILoggingService from "./types/ILoggingService";
import IThreeDSService from "./types/IThreeDSService";
export default class ThreeDSService implements IThreeDSService {
    private authToken;
    private apiBase;
    private apiKey;
    private httpService;
    private logger;
    constructor(authToken: string, apiBase: string, apiKey: string, httpService: IHttpService, elementsService: IElementsService, logger: ILoggingService);
    private walletId;
    initializeCardinal(sessionId: string): Promise<string>;
    verifyEnrollment(sessionId: string, paymentInstrumentId: string): Promise<ValidatePaymentsResponse>;
}
