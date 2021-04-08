import ActionBase from "./actionBase";
import { IAction } from "./types/IAction";

export default class ValidateCard extends ActionBase implements IAction {
    public createElement(elementType: string, targetElement: string, options?: any): void {
        // There is no element to setup so do nothing
    }

    public errors(): any[] {
        // Return any cardinal errors
        return [];
    }

    public start() {
        // Setup the cardinal library and profile the device
    }

    public complete() {
        // Validate the card initiating issuer vaidation if required
    }
}