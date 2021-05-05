import IActionResponse from './IActionResponse';
export interface IAction {
    actionConfig: IActionResponse;
    options: any;
    createFramesControl(framesControlType: string, targetElement: string, options?: any): void;
    errors(): any[];
}
