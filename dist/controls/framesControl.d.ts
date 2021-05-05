import ILoggingService from 'src/services/types/ILoggingService';
export default class FramesControl {
    type: string;
    frameElement: HTMLIFrameElement;
    containerElement: HTMLElement;
    eventHandlers: Map<string, Function[]>;
    private exception;
    private logger;
    private onFrameFocus;
    private onFrameBlur;
    private onFrameValidated;
    private onFrameCleared;
    private onFrameSubmitted;
    constructor(type: string, containerElement: HTMLElement, frameElement: HTMLIFrameElement, logger: ILoggingService);
    isValid(): boolean;
    get error(): any;
    set error(value: any);
    clear(): Promise<boolean>;
    validate(): Promise<boolean>;
    submit(): Promise<boolean>;
    private performAction;
}
