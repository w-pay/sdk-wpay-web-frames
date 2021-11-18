import { inject, injectable } from "inversify";
import { ServiceTypes } from "../services";

import ActionBase from "./actionBase";
import { IAction } from "./types/IAction";

import { LogLevel } from "../domain/logLevel";

import IThreeDSService from "../services/types/IThreeDSService";
import ILoggingService from "../services/types/ILoggingService";
import IFramesService from "../services/types/IFramesService";

import loadSongbirdStaging from "../resources/songbird-staging";
import loadSongbirdProduction from "../resources/songbird-production";

@injectable()
export default class ValidatePayment extends ActionBase implements IAction {
    constructor(
        @inject(ServiceTypes.FramesService) framesService: IFramesService,
        @inject(ServiceTypes.ThreeDSService) private threeDSService: IThreeDSService,
        @inject(ServiceTypes.LoggingService) logger: ILoggingService) {
            super(framesService, logger);
    }

    public createFramesControl(framesControlType: string, targetElementId: string, options?: any): void {
        let targetElement = document.getElementById(targetElementId);
        if (!targetElement) throw new Error("Target element not found");

        this.targetElementId = targetElementId;
    }

    public errors(): any[] {
        // TODO: Return any cardinal errors
        return [];
    }

    public async start() {
        // TODO: Make this configurable
        if (this.options?.threeDS?.env === "prod") {
            loadSongbirdProduction();
        } else {
            loadSongbirdStaging();
        }

        try {
            if (!this.options.sessionId || this.options.sessionId.length <= 0 || typeof this.options.sessionId !== "string") throw new Error("Invalid sessionId");
            await this.threeDSService.initializeCardinal(this.options.sessionId, this.targetElementId);
            
        } catch (e) {
            this.logger.log(e as string, LogLevel.ERROR);
        }
    }

    public async complete() {
        // Validate the card initiating issuer vaidation if required
        return await this.threeDSService.verifyEnrollment(this.options.sessionId, this.targetElementId, this.options.paymentInstrumentId, this.options.threeDS);
    }
}