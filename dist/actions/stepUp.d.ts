import ActionBase from './actionBase';
import IStepUp from './types/IStepUp';
export default class StepUp extends ActionBase implements IStepUp {
    start(useEveryDayPay: boolean): Promise<void>;
    validate(): Promise<boolean>;
    submit(): Promise<boolean>;
    complete(): Promise<any>;
    clear(): Promise<boolean>;
}
