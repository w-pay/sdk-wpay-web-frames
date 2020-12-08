import ElementControl from '../controls/elementControl';
import ActionBase from './actionBase';
import ICaptureCard from './types/ICaptureCard';
import { LogLevel } from '../domain/logLevel';

export default class CaptureCard extends ActionBase implements ICaptureCard {
    public async start(useEveryDayPay: boolean) {
        this.logger.log(`Initialising card capture action`, LogLevel.INFO)
        this.actionConfig = await this.elementsService.initialiseAction('capture-card', useEveryDayPay, this.props);
    }

    public async validate(): Promise<boolean> {
        this.logger.log('Validating elements', LogLevel.INFO);

        try {
            if (this.elements.has('CardGroup')) {
                await (this.elements.get('CardGroup') as ElementControl).validate().then(
                    (result) => {
                        if (!result) throw 'One or more elements failed validation';
                    });
                } else {
                // First, check to ensure that we have all of the elements that we need
                let missingElements = [];

                const cardNo = this.elements.get('CardNo');
                if (cardNo === undefined) missingElements.push('cardNo');

                const cardExpiry = this.elements.get('CardExpiry');
                if (cardExpiry === undefined) missingElements.push('CardExpiry');

                const cardCVV = this.elements.get('CardCVV');
                if (cardCVV === undefined) missingElements.push('CardCVV');

                // Check to see if there are any elements missing - used elements rather than missing elements length to satisfy compiler that undefined had been handled
                if (!cardNo || !cardExpiry || !cardCVV) {
                    throw `Missing required elements: ${missingElements.join(', ')}`;
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

                if (!success) throw 'One or more elements failed validation';
            }
        } catch (e) {
            // There was a problem during vaidation
            this.logger.log('CaptureCard: Validation failed', LogLevel.INFO);
            return false;
        }

        //Validation successful
        this.logger.log('CaptureCard: Validation successful', LogLevel.INFO);
        return true;
    }

    public async submit(): Promise<boolean> {
        // Validate the elements prior to submitting
        if (!await this.validate()) return false;

        // Elements are all present and valid, proceed to submit
        this.logger.log ('CaptureCard: Submiting elements', LogLevel.INFO);

        try {
            // can cast elements are not undefined as check was done as part of validation
            if (this.elements.has('CardGroup')) {
                await (this.elements.get('CardGroup') as ElementControl).submit();
            } else {
                const cardNo = this.elements.get('CardNo') as ElementControl;
                const cardExpiry = this.elements.get('CardExpiry') as ElementControl;
                const cardCVV = this.elements.get('CardCVV') as ElementControl;

                // Submit all parts and wait for them to return
                await Promise.all([
                    cardNo.submit(),
                    cardExpiry.submit(),
                    cardCVV.submit()
                ]);
            }

            this.logger.log('CaptureCard: Submit Successful', LogLevel.INFO);

            return true;
        } catch (e) {
            this.logger.log('CaptureCard: Submit failed', LogLevel.INFO);
            return false;
        }
    }

    public async complete(): Promise<any> {
        this.logger.log(`CaptureCard: Completing card capture action`, LogLevel.INFO);
        try {
            const response = await this.elementsService.completeAction('capture-card', this.actionConfig.sessionId, this.actionConfig.actionId);

            this.logger.log('CaptureCard: Complete Successful', LogLevel.INFO);

            return response;
        } catch (e) {
            this.logger.log('CaptureCard: Complete failed', LogLevel.INFO);

            return false;
        }
    }

    public async clear(): Promise<boolean> {
        try {
            const promises: Promise<boolean>[] = [];

            // Call clear on all elements
            this.elements.forEach((element) => {
                promises.push(element.clear());
            });
        
            // Wait for all elements to clear
            await Promise.all(promises);

            this.logger.log('CaptureCard: Clear Successful', LogLevel.INFO);

            return true;
        } catch(ex) {
            this.logger.log('CaptureCard: Clear failed', LogLevel.INFO);

            return false;
        }
    }
}