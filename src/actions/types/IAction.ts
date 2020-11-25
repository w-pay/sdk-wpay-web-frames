import ElementControl from 'src/controls/elementControl';
import IActionResponse from './IActionResponse';

export interface IAction {
    actionConfig: IActionResponse;

    createElement(elementType: string, targetElement: string, options?: any): void;
    errors(): any[];
}