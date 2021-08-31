import ActionBase from "./actionBase";
import { IAction } from "./types/IAction";

import loadSongbirdStaging from "../resources/songbird-staging";
import loadSongbirdProduction from "../resources/songbird-production";
import { inject, injectable } from "inversify";
import { ServiceTypes } from "../services";

import IThreeDSService from "../services/types/IThreeDSService";
import ILoggingService from "../services/types/ILoggingService";
import IFramesService from "../services/types/IFramesService";
import { LogLevel } from "../domain/logLevel";

@injectable()
export default class ValidateCard extends ActionBase implements IAction {
    constructor(
        @inject(ServiceTypes.FramesService) framesService: IFramesService,
        @inject(ServiceTypes.ThreeDSService) private threeDSService: IThreeDSService,
        @inject(ServiceTypes.LoggingService) logger: ILoggingService) {
            super(framesService, logger);
    }

    public createFramesControl(framesControlType: string, targetElement: string, options?: any): void {
        // There are no frames to setup so do nothing
    }

    public errors(): any[] {
        // Return any cardinal errors
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
            await this.threeDSService.initializeCardinal(this.options.sessionId);
            
        } catch (e) {
            this.logger.log(e, LogLevel.ERROR);
            throw e;
        }
    }

    public async complete() {
        // Validate the card initiating issuer vaidation if required
        return await this.threeDSService.verifyEnrollment(this.options.sessionId, this.options.paymentInstrumentId, this.options.threeDS);
    }
}