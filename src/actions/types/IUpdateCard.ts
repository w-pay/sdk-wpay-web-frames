import IChallengeResponse from "../../domain/IChallengeResponse";
import { IAction } from "./IAction";

export default interface IUpdateCard extends IAction {
    start(): Promise<void>;
    validate(): Promise<void>;
    submit(): Promise<void>;
    complete(challengeResponses?: IChallengeResponse[]): Promise<any>;
    clear(): Promise<void>;
}