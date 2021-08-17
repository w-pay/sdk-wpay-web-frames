import ActionBase from './actionBase';
import IUpdateCard from './types/IUpdateCard';
export default class UpdateCard extends ActionBase implements IUpdateCard {
    start(): Promise<void>;
    validate(): Promise<void>;
    submit(): Promise<void>;
    complete(challengeResponses?: any[]): Promise<any>;
    clear(): Promise<void>;
}
