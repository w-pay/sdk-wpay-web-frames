import { inject, injectable } from "inversify";
import { LogLevel } from "../customer";
import ValidatePaymentsResponse from "../domain/validatePaymentResponse";
import { ServiceTypes } from ".";
import IElementsService from "./types/IElementsService";
import IHttpService from "./types/IHttpService";
import ILoggingService from "./types/ILoggingService";
import IThreeDSService from "./types/IThreeDSService";

declare var Cardinal:any;

@injectable()
export default class ThreeDSService implements IThreeDSService {
    constructor(
        @inject("authToken") private authToken: string,
        @inject("apiBase") private apiBase: string,
        @inject("apiKey") private apiKey: string,
        @inject(ServiceTypes.HttpService) private httpService: IHttpService,
        @inject(ServiceTypes.ElementsService) elementsService: IElementsService,
        @inject(ServiceTypes.LoggingService) private logger: ILoggingService) {}

    private walletId = "4fa9e893-2fb9-4516-bfc5-6fa8cd903528";

    public async initializeCardinal(sessionId: string): Promise<string> {
        if (this.logger.getLevel() >= LogLevel.DEBUG) {
            Cardinal.configure({
                logging: {
                    level: "on"
                }
            });
        }

        var promise = new Promise<string>((resolve, reject) => {
            Cardinal.on('payments.setupComplete', async (e: any) => {
                // At this point, if successful, the device fingerpront has been stored and we have a cardinal sessionId
                resolve(e.sessionId);
                Cardinal.off('payments.setupComplete');
            });

            Cardinal.setup("init", {
                jwt: sessionId
            });
        });

        const initResponse = await promise;

        // Once initialized, start a new cardinal transaction.  This appears to be the only way to allow multiple Cardinal retries.
        Cardinal.start('cca', {}, sessionId);

        return initResponse;
    }

    public async verifyEnrollment(sessionId: string, paymentInstrumentId: string): Promise<ValidatePaymentsResponse> {
        const response = await fetch(`${this.apiBase}/customer/3ds/session/enrolment`, {
            method: 'POST',
            headers: {
                'x-api-key': this.apiKey,
                'authorization': this.authToken,
                'x-wallet-id': this.walletId,
                'x-session-id': sessionId,
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({
                data: {
                    sessionId
                }
            })
        });

        const payload = await response.json();

        const promise = new Promise<ValidatePaymentsResponse>((resolve, reject) => {
            Cardinal.on("payments.validated", (data: any, jwt: string) => {
                this.logger.log(`Issuer authentication complete`, LogLevel.DEBUG);

                resolve({ 
                    threeDSData: data,
                    challengeResponse: {
                        type: "3DS",
                        instrumentId: paymentInstrumentId,
                        token: data.Payment.ProcessorTransactionId,
                        reference: sessionId,

                    }
                });
                Cardinal.off("payments.validated");
            });

            if (payload.status === "PENDING_AUTHENTICATION") {
                this.logger.log(`${payload.status}: Issuer authentication required`, LogLevel.DEBUG);
                Cardinal.continue('cca',
                    {
                        "AcsUrl": payload.consumerAuthenticationInformation.acsUrl,
                        "Payload": payload.consumerAuthenticationInformation.pareq,
                    },
                    {
                        "OrderDetails": {
                            "TransactionId": payload.consumerAuthenticationInformation.authenticationTransactionId
                        }
                    },
                    sessionId);
            } 
            else if (payload.status === "AUTHENTICATION_SUCCESSFUL") {
                this.logger.log(`${payload.status}: Issuer authentication not required`, LogLevel.DEBUG);
                resolve({ 
                    threeDSData: payload,
                    challengeResponse: {
                        type: "3DS-frictionless",
                        instrumentId: paymentInstrumentId,
                        token: payload.challengeResponseToken,
                        reference: sessionId,

                    }
                 });
            }
            else {
                this.logger.log(`${payload.status || "UNKNOWN"}: There was a problem authenticating`, LogLevel.DEBUG);
                resolve({ threeDSData: payload });
            }
        });

        return await promise;
    }
}