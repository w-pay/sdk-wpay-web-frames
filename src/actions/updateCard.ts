import FramesControl from '../controls/framesControl';
import ActionBase from './actionBase';
import IUpdateCard from './types/IUpdateCard';
import { LogLevel } from '../domain/logLevel';

export default class UpdateCard extends ActionBase implements IUpdateCard {
    public async start(useEveryDayPay: boolean) {
        this.logger.log(`Initialising update card action`, LogLevel.INFO)
        this.actionConfig = await this.framesService.initialiseAction('update-card', useEveryDayPay, this.options);
    }

    public async validate(): Promise<void> {
        this.logger.log('Validating frames', LogLevel.INFO);

        try {
            // First, check to ensure that we have all of the frmaes that we need
            let missingFrames = [];

            const cardExpiry = this.frames.get('CardExpiry');
            if (cardExpiry === undefined) missingFrames.push('CardExpiry');

            const cardCVV = this.frames.get('CardCVV');
            if (cardCVV === undefined) missingFrames.push('CardCVV');

            // Check to see if there are any frames missing
            if (!cardExpiry || !cardCVV) {
                throw `Missing required frames: ${missingFrames.join(', ')}`;
            }

            let success = true;

            // Validate all of the controls
            await Promise.all([
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
        } catch (e) {
            // There was a problem during vaidation
            this.logger.log('UpdateCard: Validation failed', LogLevel.INFO);
            throw e;
        }

        //Validation successful
        this.logger.log('UpdateCard: Validation successful', LogLevel.INFO);
    }

    public async submit(): Promise<void> {
        // Validate the frames prior to submitting
        await this.validate();

        // Frames are all present and valid, proceed to submit
        this.logger.log ('UpdateCard: Submiting frames', LogLevel.INFO);

        try {
            const cardExpiry = this.frames.get('CardExpiry') as FramesControl;
            const cardCVV = this.frames.get('CardCVV') as FramesControl;

            // Submit all parts and wait for them to return
            await Promise.all([
                cardExpiry.submit(),
                cardCVV.submit()
            ]);

            this.logger.log('UpdateCard: Submit Successful', LogLevel.INFO);
        } catch (e) {
            this.logger.log('UpdateCard: Submit failed', LogLevel.INFO);
            throw e;
        }
    }

    public async complete(): Promise<any> {
        this.logger.log(`UpdateCard: Completing card capture action`, LogLevel.INFO);
        try {
            const response = await this.framesService.completeAction('update-card', this.actionConfig.sessionId, this.actionConfig.actionId);

            this.logger.log('UpdateCard: Complete Successful', LogLevel.INFO);

            return response;
        } catch (e) {
            this.logger.log('UpdateCard: Complete failed', LogLevel.INFO);

            throw e;
        }
    }

    public async clear(): Promise<void> {
        try {
            const promises: Promise<boolean>[] = [];

            // Call clear on all frames
            this.frames.forEach((control) => {
                promises.push(control.clear());
            });
        
            // Wait for all frames to clear
            await Promise.all(promises);

            this.logger.log('UpdateCard: Clear Successful', LogLevel.INFO);
        } catch(ex) {
            this.logger.log('UpdateCard: Clear failed', LogLevel.INFO);

            throw ex;
        }
    }
}