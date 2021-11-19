import FramesControl from '../controls/framesControl';
import ActionBase from './actionBase';
import ICaptureCard from './types/ICaptureCard';
import { LogLevel } from '../domain/logLevel';

import { inject, injectable } from 'inversify';
import { ServiceTypes } from '../services';
import IFramesService from '../services/types/IFramesService';
import IThreeDSService from '../services/types/IThreeDSService';
import ILoggingService from '../services/types/ILoggingService';

@injectable()
export default class CaptureCard extends ActionBase implements ICaptureCard {
    constructor(
        @inject(ServiceTypes.FramesService) framesService: IFramesService,
        @inject(ServiceTypes.ThreeDSService) private threeDSService: IThreeDSService,
        @inject(ServiceTypes.LoggingService) logger: ILoggingService) {
            super(framesService, logger);
    }

    public async start() {
        this.logger.log(`Initialising card capture action`, LogLevel.INFO)
        this.actionConfig = await this.framesService.initialiseAction('capture-card', this.options);
    }

    public async validate(): Promise<void> {
        this.logger.log('Validating frames', LogLevel.INFO);

        try {
            if (this.frames.has('CardGroup')) {
                await (this.frames.get('CardGroup') as FramesControl).validate().then(
                    (result) => {
                        if (!result) throw 'One or more frames failed validation';
                    });
            } else {
                // First, check to ensure that we have all of the frames that we need
                let missingFrames = [];

                const cardNo = this.frames.get('CardNo');
                if (cardNo === undefined) missingFrames.push('cardNo');

                const cardExpiry = this.frames.get('CardExpiry');
                if (cardExpiry === undefined) missingFrames.push('CardExpiry');

                const cardCVV = this.frames.get('CardCVV');
                if (cardCVV === undefined) missingFrames.push('CardCVV');

                // Check to see if there are any frames missing
                if (!cardNo || !cardExpiry || !cardCVV) {
                    throw `Missing required frames: ${missingFrames.join(', ')}`;
                }

                let success = true;

                // Validate all of the controls
                await Promise.all([
                    cardNo.validate().then(
                            (result) => {
                                if (!result) success = false;
                            }),
                    cardExpiry.validate().then(
                            (result) => {
                                if (!result) success = false;
                            }),
                    cardCVV.validate().then(
                            (result) => {
                                if (!result) success = false;
                            })
                ]);

                if (!success) throw 'One or more frames failed validation';
            }
        } catch (e) {
            // There was a problem during vaidation
            this.logger.log('CaptureCard: Validation failed', LogLevel.INFO);
            throw e;
        }

        //Validation successful
        this.logger.log('CaptureCard: Validation successful', LogLevel.INFO);
    }

    public async submit(): Promise<void> {
        // Validate the frames prior to submitting
        await this.validate();

        // Frames are all present and valid, proceed to submit
        this.logger.log ('CaptureCard: Submiting frames', LogLevel.INFO);

        try {
            if (this.frames.has('CardGroup')) {
                await (this.frames.get('CardGroup') as FramesControl).submit();
            } else {
                const cardNo = this.frames.get('CardNo') as FramesControl;
                const cardExpiry = this.frames.get('CardExpiry') as FramesControl;
                const cardCVV = this.frames.get('CardCVV') as FramesControl;

                // Submit all frames and wait for them to return
                await Promise.all([
                    cardNo.submit(),
                    cardExpiry.submit(),
                    cardCVV.submit()
                ]);
            }

            this.logger.log('CaptureCard: Submit Successful', LogLevel.INFO);
        } catch (e) {
            this.logger.log('CaptureCard: Submit failed', LogLevel.INFO);
            throw e;
        }
    }

    public async complete(save: boolean = true, challengeResponses: any[] = []): Promise<any> {
        this.logger.log(`CaptureCard: Completing card capture action`, LogLevel.INFO);
        this.options.save = save;
        

        this.logger.log(`CaptureCard: Challengeresponses ${challengeResponses}`, LogLevel.INFO);

        try {
            const response = await this.framesService.completeAction('capture-card', this.actionConfig.sessionId, this.actionConfig.actionId, this.options, challengeResponses);

            if (response.message === "3DS TOKEN REQUIRED") {
                this.logger.log('CaptureCard: 3DS TOKEN REQUIRED', LogLevel.INFO);
            } else {
                this.logger.log('CaptureCard: Complete Successful', LogLevel.INFO);
            }

            return response;
        } catch (e) {
            this.logger.log('CaptureCard: Complete failed', LogLevel.INFO);

            throw e;
        }
    }

    public async clear(): Promise<void> {
        try {
            const promises: Promise<boolean>[] = [];

            // Call clear on all frames
            this.frames.forEach(control => {
                promises.push(control.clear());
            });
        
            // Wait for all frames to clear
            await Promise.all(promises);

            this.logger.log('CaptureCard: Clear Successful', LogLevel.INFO);
        } catch(ex) {
            this.logger.log('CaptureCard: Clear failed', LogLevel.INFO);

            throw ex;
        }
    }
}