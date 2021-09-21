import { inject, injectable } from "inversify";
import ValidatePaymentsResponse from "../domain/validatePaymentResponse";
import { ServiceTypes } from ".";
import ILoggingService from "./types/ILoggingService";
import IThreeDSService from "./types/IThreeDSService";
import { LogLevel } from "../domain/logLevel";
import IHttpService from "./types/IHttpService";

declare var Cardinal:any;

@injectable()
export default class ThreeDSService implements IThreeDSService {
    constructor(
        @inject("authToken") private authToken: string,
        @inject("apiBase") private apiBase: string,
        @inject("apiKey") private apiKey: string,
        @inject(ServiceTypes.HttpService) private httpService: IHttpService,
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
                this.logger.log(e, LogLevel.DEBUG);
                
                resolve(e.sessionId);
                Cardinal.off('payments.setupComplete');
            });

            Cardinal.setup("init", {
                jwt: sessionId
            }).catch((error: any) => {
                this.logger.log(error, LogLevel.ERROR);
                reject(error);
            });
        });

        const initResponse = await promise;

        return initResponse;
    }

    public async verifyEnrollment(sessionId: string, paymentInstrumentId?: string, threeDS?: any): Promise<ValidatePaymentsResponse> {
        const response = await this.httpService.fetch(`${this.apiBase}/customer/3ds/session/enrolment`, {
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
                    sessionId,
                    options: threeDS
                }
            })
        });

        const payload = await response.data;

        const promise = new Promise<ValidatePaymentsResponse>((resolve, reject) => {
            Cardinal.on("payments.validated", (data: any, jwt: string) => {
                this.logger.log(`Issuer authentication complete`, LogLevel.DEBUG);

                this.logger.log(JSON.stringify(data), LogLevel.DEBUG);

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

            if (payload.data.enrollmentResponse.status === "PENDING_AUTHENTICATION") {
                this.logger.log(`${payload.status}: Issuer authentication required`, LogLevel.DEBUG);
                this.logger.log(JSON.stringify(payload.data.enrollmentResponse), LogLevel.DEBUG);
                Cardinal.continue('cca',
                    {
                        "AcsUrl": payload.data.enrollmentResponse.consumerAuthenticationInformation.acsUrl,
                        "Payload": payload.data.enrollmentResponse.consumerAuthenticationInformation.pareq,
                    },
                    {
                        "OrderDetails": {
                            "TransactionId": payload.data.enrollmentResponse.consumerAuthenticationInformation.authenticationTransactionId
                        }
                    },
                    sessionId);
            } 
            else if (payload.data.enrollmentResponse.status === "AUTHENTICATION_SUCCESSFUL") {
                this.logger.log(`${payload.status}: Issuer authentication not required`, LogLevel.DEBUG);
                resolve({ 
                    threeDSData: payload.data.enrollmentResponse,
                    challengeResponse: {
                        type: "3DS-frictionless",
                        instrumentId: paymentInstrumentId,
                        token: payload.data.challengeResponseToken,
                        reference: sessionId,

                    }
                 });
            }
            else {
                this.logger.log(`${payload.data.enrollmentResponse.status || "UNKNOWN"}: There was a problem authenticating`, LogLevel.DEBUG);
                resolve({ threeDSData: payload });
            }
        });

        const result = await promise;

        Cardinal.off("payments.validated");

        return result;
    }
}