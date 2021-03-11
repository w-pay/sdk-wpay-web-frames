import ElementControl from '../controls/elementControl';
import ActionBase from './actionBase';
import { LogLevel } from '../domain/logLevel';
import IStepUp from './types/IStepUp';

export default class StepUp extends ActionBase implements IStepUp {
    public async start(useEveryDayPay: boolean) {
        this.logger.log(`Initialising step up action`, LogLevel.INFO)
        this.actionConfig = await this.elementsService.initialiseAction('step-up', useEveryDayPay, this.props);
    }

    public async validate(): Promise<void> {
        this.logger.log('Validating elements', LogLevel.INFO);

        try {
            // First, check to ensure that we have all of the elements that we need
            const missingElements = [];

            const cardCVV = this.elements.get('CardCVV');
            if (cardCVV === undefined) missingElements.push('CardCVV');

            // Check to see if there are any elements missing - used elements rather than missing elements length to satisfy compiler that undefined had been handled
            if (!cardCVV) {
                throw `Missing required elements: ${missingElements.join(', ')}`;
            }

            let success = true;

            // Validate all of the controls
            await Promise.all([
                cardCVV.validate().then(
                    (result) => {
                        if (!result) success = false;
                    })
            ]);

            if (!success) throw 'One or more elements failed validation';
        } catch (e) {
            // There was a problem during vaidation
            this.logger.log('StepUp: Validation failed', LogLevel.INFO);
            throw e;
        }

        //Validation successful
        this.logger.log('StepUp: Validation successful', LogLevel.INFO);
    }

    public async submit(): Promise<boolean> {
        // Validate the elements prior to submitting
        await this.validate();

        // Elements are all present and valid, proceed to submit
        this.logger.log('StepUp: Submiting elements', LogLevel.INFO);

        try {
            const cardCVV = this.elements.get('CardCVV') as ElementControl;
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
            const response = await this.elementsService.completeAction('step-up', this.actionConfig.sessionId, this.actionConfig.actionId);

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

            // Call clear on all elements
            this.elements.forEach((element) => {
                promises.push(element.clear());
            });

            // Wait for all elements to clear
            await Promise.all(promises);

            this.logger.log('StepUp: Clear Successful', LogLevel.INFO);
        } catch (ex) {
            this.logger.log('StepUp: Clear failed', LogLevel.INFO);

            throw ex;
        }
    }
}