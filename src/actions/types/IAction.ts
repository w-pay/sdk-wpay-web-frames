import IActionResponse from './IActionResponse';

export interface CardDetails {
    cardNo: string;
    expiry: string;
    cvv: string;
}

export interface IAction {
    actionConfig: IActionResponse;
    options: any;

    createFramesControl(framesControlType: string, targetElement: string, options?: any): void;
    injectCardDetailsFromPciScopedRuntime(cardDetails: CardDetails): Promise<void>;
    errors(): any[];
}
