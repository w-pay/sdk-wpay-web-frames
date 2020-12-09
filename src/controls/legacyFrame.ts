import { ServiceTypes } from '../services';
import { inject } from 'inversify';
import ILoggingService from '../services/types/ILoggingService';
import { LogLevel } from '../domain/logLevel';

export interface ICardCaptureOptions {
    host: string;
    accessToken: string;
    targetElementId: string;
}

export default class LegacyFrame {
    private authToken!: string;
    public logger!: ILoggingService;

    public options: ICardCaptureOptions | null = null;
    private parentElement: HTMLElement | null = null;
    private hostUri: string;
    
    private successEvent = new CustomEvent("CardCaptureSuccess", {});
    private errorEvent = new CustomEvent("CardCaptureError", {});

    constructor(
        hostUri: string,
        authToken: string,
        @inject(ServiceTypes.LoggingService) logger: ILoggingService
    ) {
        this.hostUri = hostUri;
        this.authToken = authToken;
    }

    // Initialise the control, injecting a host IFrame into the target HTML Element (Likely a div)
    initCardCapture(options: ICardCaptureOptions) {
        this.options = options;

        this.parentElement = document.getElementById(this.options.targetElementId);
        
        if (this.parentElement !== null) this.parentElement.innerHTML = '<iframe id="cardCaptureFrame" src="" style="border:0; width: 100%;"></iframe>';

        window.addEventListener("message", (e) => {
            switch(e.data.eventId) {
                case 'pay-frame-success':
                    if (this.parentElement !== null) this.parentElement.dispatchEvent(this.successEvent);
                    break;
                case 'pay-frame-error':
                    if (this.parentElement !== null) this.parentElement.dispatchEvent(this.errorEvent);
                    break;
            }
        });
    }

    // Generate a new capture URI and associate it with the card capture IFrame.  This is a single use URL so render needs to be called between multiple card captures.
    async render() {

        this.logger.log(`apiHost: ${this.hostUri}`, LogLevel.DEBUG)
        let response = await fetch(`${this.hostUri}/customer/instruments`, {
            headers: {
                'Authorization': this.authToken
            },
            body: JSON.stringify({
                data: {
                    clientReference: "12345"
                },
                meta: {}
            })
        });

        const responseData = await response.json();

        let frame = document.getElementById('cardCaptureFrame') as HTMLFrameElement;
        frame.src = responseData.data.cardCaptureURL;
    }

    submit() {
        let frame = document.getElementById("cardCaptureFrame") as HTMLFrameElement;

        if (frame !== null && frame.contentWindow != null) {
            frame.contentWindow.postMessage({eventId: "pay-frame-submit", save: true , primary: true, verify:true}, '*');
        }
    }
}