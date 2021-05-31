import FramesControl from '../controls/framesControl';
import ActionBase from './actionBase';
import { LogLevel } from '../domain/logLevel';
import IStepUp from './types/IStepUp';

export default class StepUp extends ActionBase implements IStepUp {
    public async start() {
        this.logger.log(`Initialising step up action`, LogLevel.INFO)
        this.actionConfig = await this.framesService.initialiseAction('step-up', this.options);
    }

    public async validate(): Promise<void> {
        this.logger.log('Validating frames', LogLevel.INFO);

        try {
            // First, check to ensure that we have all of the frames that we need
            const missingFrames = [];

            const cardCVV = this.frames.get('CardCVV');
            if (cardCVV === undefined) missingFrames.push('CardCVV');

            // Check to see if there are any frames missing
            if (!cardCVV) {
                throw `Missing required frames: ${missingFrames.join(', ')}`;
            }

            let success = true;

            // Validate all of the controls
            await Promise.all([
                cardCVV.validate().then(
                    (result) => {
                        if (!result) success = false;
                    })
            ]);

            if (!success) throw 'One or more frames failed validation';
        } catch (e) {
            // There was a problem during vaidation
            this.logger.log('StepUp: Validation failed', LogLevel.INFO);
            throw e;
        }

        //Validation successful
        this.logger.log('StepUp: Validation successful', LogLevel.INFO);
    }

    public async submit(): Promise<boolean> {
        // Validate the frames prior to submitting
        await this.validate();

        // Frames are all present and valid, proceed to submit
        this.logger.log('StepUp: Submiting frames', LogLevel.INFO);

        try {
            const cardCVV = this.frames.get('CardCVV') as FramesControl;
            await cardCVV.submit();

            this.logger.log('StepUp: Submit Successful', LogLevel.INFO);

            return true;
        } catch (e) {
            this.logger.log('StepUp: Submit failed', LogLevel.INFO);
            throw e;
        }
    }

    public async complete(): Promise<any> {
        this.logger.log(`StepUp: Completing card capture action`, LogLevel.INFO);
        try {
            const response = await this.framesService.completeAction('step-up', this.actionConfig.sessionId, this.actionConfig.actionId, this.options);

            this.logger.log('StepUp: Complete Successful', LogLevel.INFO);

            return response;
        } catch (e) {
            this.logger.log('StepUp: Complete failed', LogLevel.INFO);

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

            this.logger.log('StepUp: Clear Successful', LogLevel.INFO);
        } catch (ex) {
            this.logger.log('StepUp: Clear failed', LogLevel.INFO);

            throw ex;
        }
    }
}