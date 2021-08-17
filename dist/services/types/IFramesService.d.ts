import IActionResponse from 'src/actions/types/IActionResponse';
export default interface IFramesService {
    initialiseAction(actionType: string, props: any): Promise<IActionResponse>;
    completeAction(actionType: string, sessionId: string, actionId: string, props: any, challengeResponses: any[]): Promise<any>;
}
