import { inject, injectable } from "inversify";
import { ServiceTypes } from "../services";
import IElementsService from "../services/types/IElementsService";
import IHttpService from "../services/types/IHttpService";
import ILoggingService from "../services/types/ILoggingService";
import ActionBase from "./actionBase";
import { IAction } from "./types/IAction";

import "cardinal-commerce-songbird-staging";
declare var Cardinal: any;

@injectable()
export default class ValidatePayment extends ActionBase implements IAction {

    constructor(
        @inject("authToken") private authToken: string,
        @inject("apiBase") private apiBase: string,
        @inject("apiKey") private apiKey: string,
        @inject(ServiceTypes.HttpService) private httpService: IHttpService,
        @inject(ServiceTypes.ElementsService) elementsService: IElementsService,
        @inject(ServiceTypes.LoggingService) logger: ILoggingService) {
            super(elementsService, logger);
    }

    private gatewayServiceBaseURL = "http://localhost:3020"; 
    private walletId = "4fa9e893-2fb9-4516-bfc5-6fa8cd903528";

    public createElement(elementType: string, targetElement: string, options?: any): void {
        // There is no element to setup so do nothing
    }

    public errors(): any[] {
        // Return any cardinal errors
        return [];
    }

    public async start() {
        try {
            if (!this.props.sessionId || this.props.sessionId.length <= 0 || typeof this.props.sessionId !== "string") throw new Error("Invalid sessionId");
            await this.initialiseCardinal(this.props.sessionId);
            
        } catch (e) {
            console.log(e);
        }
    }

    public async complete() {
        // Validate the card initiating issuer vaidation if required
        return await this.verifyEnrollment(this.props.sessionId);
    }

    private async initialiseCardinal(sessionId: string) {
        Cardinal.configure({
            logging: {
                level: "on"
            }
        });

        var promise = new Promise((resolve, reject) => {
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

    async verifyEnrollment(sessionId: string): Promise<ValidatePaymentsResponse> {
        const response = await fetch(`${this.gatewayServiceBaseURL}/customer/checkEnrollment`, {
            method: 'POST',
            headers: {
                'x-api-key': this.apiKey,
                'authorization': this.authToken,
                'x-wallet-id': this.walletId,
                'x-session-id': sessionId
            },
            body: JSON.stringify({
                instrumentId: '123456'
            })
        });

        const payload = await response.json();

        const promise = new Promise<ValidatePaymentsResponse>((resolve, reject) => {
            Cardinal.on("payments.validated", (data: any, jwt: string) => {
                console.log(`Issuer authentication complete`);
                resolve({ 
                    threeDSData: data,
                    challengResponse: {
                        type: "3DS",
                        instrumentId: this.props.paymentInstrumentId,
                        token: data.Payment.ProcessorTransactionId,
                        refernce: sessionId,

                    }
                });
                Cardinal.off("payments.validated");
            });

            if (payload.status === "PENDING_AUTHENTICATION") {
                console.log(`${payload.status}: Issuer authentication required`);
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
                console.log(`${payload.status}: Issuer authentication not required`);
                resolve({ 
                    threeDSData: payload,
                    challengResponse: {
                        type: "3DS-frictionless",
                        instrumentId: this.props.paymentInstrumentId,
                        token: payload.challengeResponseToken,
                        refernce: sessionId,

                    }
                 });
            }
            else {
                console.log(`${payload.status || "UNKNOWN"}: There was a problem authenticating`);
                resolve({ threeDSData: payload });
            }
        });

        return await promise;
    }
}

class ValidatePaymentsResponse {
    public threeDSData?: string;
    public challengResponse?: any;
}