import IActionResponse from 'src/actions/types/IActionResponse';
export default interface IElementsService {
    initialiseAction(actionType: string, useEverydayPay: boolean): Promise<IActionResponse>;
    completeAction(actionType: string, sessionId: string, actionId: string): Promise<void>;
}
