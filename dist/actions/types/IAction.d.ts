import IActionResponse from './IActionResponse';
export interface IAction {
    actionConfig: IActionResponse;
    props: any;
    createElement(elementType: string, targetElement: string, options?: any): void;
    errors(): any[];
}
