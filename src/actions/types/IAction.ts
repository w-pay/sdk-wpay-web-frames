import IActionResponse from './IActionResponse';

export interface IAction {
    actionConfig: IActionResponse;
    props: any;

    createFramesControl(framesControlType: string, targetElement: string, options?: any): void;
    errors(): any[];
}