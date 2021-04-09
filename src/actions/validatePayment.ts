import { inject, injectable } from "inversify";
import { ServiceTypes } from "src/services";
import IElementsService from "../services/types/IElementsService";
import IHttpService from "../services/types/IHttpService";
import ILoggingService from "../services/types/ILoggingService";
import ActionBase from "./actionBase";
import { IAction } from "./types/IAction";

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

    public createElement(elementType: string, targetElement: string, options?: any): void {
        // There is no element to setup so do nothing
    }

    public errors(): any[] {
        // Return any cardinal errors
        return [];
    }

    public async start() {
        const gatewayServiceBaseURL = "http://localhost:3020";

        // Move all of this to the wallet elements init call
        const response = await fetch(`${gatewayServiceBaseURL}/customer/initialise`, {
            method: 'POST',
            headers: {
                'x-api-key': this.apiKey,
                'authorization': this.authToken,
                'x-wallet-id': "4fa9e893-2fb9-4516-bfc5-6fa8cd903528"
            },
            body: JSON.stringify({})
        });

        this.actionConfig = {
            actionId: '',
            URL: '',
            sessionId: await response.text()
        }
        
        // Setup the cardinal library and profile the device
    }

    public complete() {
        // Validate the card initiating issuer vaidation if required
    }
}