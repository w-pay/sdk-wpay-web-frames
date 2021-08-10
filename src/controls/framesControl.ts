import ILoggingService from '../services/types/ILoggingService';
import { LogLevel } from '../domain/logLevel';
import { FramesEventType } from '../domain/framesEventType';
import { v4 } from 'uuid';

export default class FramesControl {
    public type: string;
    public frameElement: HTMLIFrameElement;
    public containerElement: HTMLElement;
    public eventHandlers = new Map<string, Function[]>();
    private exception: any;
    private logger: ILoggingService;

    constructor (type: string, containerElement: HTMLElement, frameElement: HTMLIFrameElement, logger: ILoggingService) {
        this.type = type;
        this.frameElement = frameElement;
        this.containerElement = containerElement;
        this.logger = logger;

        window.addEventListener(`message`, (e: any) => {
            // If the message has an id then it already has a handler
            // Commented out to test whether validation events would fire on submit
            // if (e.data.id) return;

            // Card group is interested in all message types
            if (this.type != 'CardGroup' && e.data.element != this.type) return;

            this.logger.log(`FrameMessage: ${JSON.stringify(e.data)}`, LogLevel.DEBUG);

            // Otherwise it was initiated by the frame, so handle it here.  At this stage validation is the only reason the frame would send a message
            switch(e.data.action) {
                case "validateElementFailed": 
                    this.error = e.data;
                    const validateElementFailedEvent = new CustomEvent(FramesEventType.OnValidated, { detail: e.data, bubbles : true });
                    this.containerElement.dispatchEvent(validateElementFailedEvent);
                    break;
                case "validateElementComplete": 
                    this.error = undefined;
                    const validateElementCompleteEvent = new CustomEvent(FramesEventType.OnValidated, { detail: e.data, bubbles : true });
                    this.containerElement.dispatchEvent(validateElementCompleteEvent);
                    break;
                case "onFocus":
                    const onFocusEvent = new CustomEvent(FramesEventType.OnFocus, { detail: e.data, bubbles : true });
                    this.containerElement.dispatchEvent(onFocusEvent);
                    break;
                case "onBlur":   
                    const onBlurEvent = new CustomEvent(FramesEventType.OnBlur, { detail: e.data, bubbles : true });
                    this.containerElement.dispatchEvent(onBlurEvent);
                    break;
            }
        });
    }

    public isValid(): boolean{
        return this.error === undefined;
    }

    public get error(): any {
        return this.exception;
    }

    public set error(value: any) {
        if (value == undefined) {
            this.containerElement.classList.remove('error');
        }
        else {
            this.containerElement.classList.add('error');
        }

        this.exception = value;
    }

    public async clear(): Promise<boolean> {
        let result = true;
        this.error = undefined;

        await this.performAction("clearElement").catch((ex: any) => {
            this.error = ex;
            result = false
        });

        return result;
    }

    public async validate(): Promise<boolean> {
        let result = true;
        this.error = undefined;

        await this.performAction("validateElement").catch((ex: any) => {
            this.error = ex;
            result = false;
        });

        return result;
    }

    public async submit(): Promise<boolean> {
        let result = true;
        this.error = undefined;
        
        await this.performAction("submitElement").catch((ex: any) => {
            this.error = ex;
            result = false;
        });

        return result;
    }

    private async performAction(action: string): Promise<void> {
        if (!this.frameElement.contentWindow) {
            return Promise.reject({
                "action": "frameActionFailed",
                "error": "IFrame not mounted to DOM"
            });
        }

        this.logger.log(`performAction: Performing action ${action}`, LogLevel.DEBUG);

        let messageHandler: any;
        
        const message = {
            id: v4(),
            element: this.type,
            action: action
        };

        const promise = new Promise((resolve, reject) => {
            messageHandler = (e: any) => {
                if (e.data.id != message.id) return;

                this.logger.log(`performAction: Action response ${e.data.action}`, LogLevel.DEBUG);

                if (e.data.action === `${action}Complete`) {
                    resolve(undefined);
                } else if (e.data.action === `${action}Failed`) {
                    reject(e.data);
                }
            }

            window.addEventListener(`message`, messageHandler);
        });

        // Get the domain of the frame to limit the scope of the message
        var url = this.frameElement.src;
        var urlParts = url.match(/^.+\:\/\/[^\/]+/)
        if (!urlParts || urlParts.length <= 0) throw `Invalid URL in frame - URL: ${url}`;
        var domain = urlParts[0];

        this.frameElement.contentWindow.postMessage(message, domain);

        const cleanUp = ()=> {
            window.removeEventListener(`message`, messageHandler);
        }

        return promise.then(cleanUp, (ex) => { cleanUp(); throw ex; });
    }
}