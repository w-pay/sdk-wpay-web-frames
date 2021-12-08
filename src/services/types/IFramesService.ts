import IActionResponse from '../../actions/types/IActionResponse';
import IChallengeResponse from '../../domain/IChallengeResponse';

export default interface IFramesService {
    initialiseAction(actionType: string, props: any): Promise<IActionResponse>;
    completeAction(actionType: string, sessionId: string, actionId: string, props: any, challengeResponses: IChallengeResponse[]): Promise<any>;
}