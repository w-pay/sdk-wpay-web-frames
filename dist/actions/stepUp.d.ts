import ActionBase from './actionBase';
import IStepUp from './types/IStepUp';
export default class StepUp extends ActionBase implements IStepUp {
    start(): Promise<void>;
    validate(): Promise<void>;
    submit(): Promise<boolean>;
    complete(): Promise<any>;
    clear(): Promise<void>;
}
