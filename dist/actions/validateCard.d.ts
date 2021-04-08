import ActionBase from "./actionBase";
import { IAction } from "./types/IAction";
export default class ValidateCard extends ActionBase implements IAction {
    createElement(elementType: string, targetElement: string, options?: any): void;
    errors(): any[];
    start(): void;
    complete(): void;
}
