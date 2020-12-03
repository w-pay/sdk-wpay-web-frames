import ActionBase from './actionBase';
import IUpdateCard from './types/IUpdateCard';
export default class UpdateCard extends ActionBase implements IUpdateCard {
    start(useEveryDayPay: boolean): Promise<void>;
    validate(): Promise<boolean>;
    submit(): Promise<boolean>;
    complete(): Promise<any>;
    clear(): Promise<boolean>;
}
