import ActionBase from './actionBase';
import ICaptureCard from './types/ICaptureCard';
export default class CaptureCard extends ActionBase implements ICaptureCard {
    start(useEveryDayPay: boolean): Promise<void>;
    validate(): Promise<void>;
    submit(): Promise<void>;
    complete(): Promise<any>;
    clear(): Promise<void>;
}
