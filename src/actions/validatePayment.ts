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
    private cardinalSessionId = "";

    public createElement(elementType: string, targetElement: string, options?: any): void {
        // There is no element to setup so do nothing
    }

    public errors(): any[] {
        // Return any cardinal errors
        return [];
    }

    public async start() {
        if (!this.props.sessionId || this.props.sessionId.length <= 0 || typeof this.props.sessionId !== "string") throw new Error("Invalid sessionId");
        await this.initialiseCardinal(this.props.sessionId);
    }

    public async complete() {
        return await this.verifyEnrollment(this.props.sessionId)
        // Validate the card initiating issuer vaidation if required
    }

    // private async injectSongbirdJS() {
    //     const script = document.createElement("script");
    //     script.type = "text/javascript";
    //     script.innerText = songbird;
    //     document.body.appendChild(script);
    // }

    private async initialiseCardinal(sessionId: string) {
        Cardinal.configure({
            logging: {
                level: "on"
            }
        });
        
        var promise = new Promise((resolve, reject) => {
            Cardinal.on('payments.setupComplete', async (e: any) => {
                // At this point, if successful, the device fingerpront has been stored and we have a sessionId
                resolve(e.sessionId);
                Cardinal.off('payments.setupComplete');
            });

            Cardinal.setup("init", {
                jwt: sessionId
            });
        });

        return await promise;
    }

    async verifyEnrollment(sessionId: string) {
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

        const json2 = await response.json();

        const promise = new Promise((resolve, reject) => {
            Cardinal.on("payments.validated", function (data: any, jwt: string) {
                console.log(`Issuer authentication complete`);
                resolve(data);
                Cardinal.off("payments.validated");
            });

            if (json2.status === "PENDING_AUTHENTICATION") {
                console.log('Issuer authentication required');
                Cardinal.continue('cca',
                    {
                        "AcsUrl": json2.consumerAuthenticationInformation.acsUrl,
                        "Payload": json2.consumerAuthenticationInformation.pareq,
                    },
                    {
                        "OrderDetails": {
                            "TransactionId": json2.consumerAuthenticationInformation.authenticationTransactionId
                        }
                    });
            } else {
                resolve({});
            }
        });

        return await promise;
    }
}