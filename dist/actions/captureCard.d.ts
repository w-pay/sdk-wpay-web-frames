import ActionBase from './actionBase';
import ICaptureCard from './types/ICaptureCard';
import IFramesService from '../services/types/IFramesService';
import IThreeDSService from '../services/types/IThreeDSService';
import ILoggingService from '../services/types/ILoggingService';
export default class CaptureCard extends ActionBase implements ICaptureCard {
    private threeDSService;
    constructor(framesService: IFramesService, threeDSService: IThreeDSService, logger: ILoggingService);
    start(): Promise<void>;
    validate(): Promise<void>;
    submit(): Promise<void>;
    complete(save?: boolean): Promise<any>;
    clear(): Promise<void>;
}
