import IChallengeResponse from "../../domain/IChallengeResponse";
import { IAction } from "./IAction";

export default interface ICaptureCard extends IAction {
    start(): Promise<void>;
    validate(): Promise<void>;
    submit(): Promise<void>;
    complete(save?: boolean, challengeResponses?: IChallengeResponse[]): Promise<any>;
    clear(): Promise<void>;
}