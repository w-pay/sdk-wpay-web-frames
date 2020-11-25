import ILoggingService from '../services/types/ILoggingService';
export interface ICardCaptureOptions {
    host: string;
    accessToken: string;
    targetElementId: string;
}
export default class LegacyFrame {
    private authToken;
    logger: ILoggingService;
    options: ICardCaptureOptions | null;
    private parentElement;
    private hostUri;
    private successEvent;
    private errorEvent;
    constructor(hostUri: string, authToken: string, logger: ILoggingService);
    initCardCapture(options: ICardCaptureOptions): void;
    render(): Promise<void>;
    submit(): void;
}
