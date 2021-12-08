import IChallengeResponse from "../../domain/IChallengeResponse";
import { IAction } from "./IAction";
export default interface IStepUp extends IAction {
    start(): Promise<void>;
    validate(): Promise<void>;
    submit(): Promise<boolean>;
    complete(challengeResponses?: IChallengeResponse[]): Promise<any>;
    clear(): Promise<void>;
}
