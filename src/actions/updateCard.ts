import ElementControl from '../controls/elementControl';
import ActionBase from './actionBase';
import IUpdateCard from './types/IUpdateCard';
import { LogLevel } from '../domain/logLevel';

export default class UpdateCard extends ActionBase implements IUpdateCard {
    public async start(useEveryDayPay: boolean) {
        this.logger.log(`Initialising update card action`, LogLevel.INFO)
        this.actionConfig = await this.elementsService.initialiseAction('update-card', useEveryDayPay, this.props);
    }

    public async validate(): Promise<boolean> {
        this.logger.log('Validating elements', LogLevel.INFO);

        try {
            // First, check to ensure that we have all of the elements that we need
            let missingElements = [];

            const cardExpiry = this.elements.get('CardExpiry');
            if (cardExpiry === undefined) missingElements.push('CardExpiry');

            const cardCVV = this.elements.get('CardCVV');
            if (cardCVV === undefined) missingElements.push('CardCVV');

            // Check to see if there are any elements missing - used elements rather than missing elements length to satisfy compiler that undefined had been handled
            if (!cardExpiry || !cardCVV) {
                throw `Missing required elements: ${missingElements.join(', ')}`;
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

            if (!success) throw 'One or more elements failed validation';
        } catch (e) {
            // There was a problem during vaidation
            this.logger.log('UpdateCard: Validation failed', LogLevel.INFO);
            return false;
        }

        //Validation successful
        this.logger.log('UpdateCard: Validation successful', LogLevel.INFO);
        return true;
    }

    public async submit(): Promise<boolean> {
        // Validate the elements prior to submitting
        if (!await this.validate()) return false;

        // Elements are all present and valid, proceed to submit
        this.logger.log ('UpdateCard: Submiting elements', LogLevel.INFO);

        try {
            
            const cardNo = this.elements.get('CardNo') as ElementControl;
            const cardExpiry = this.elements.get('CardExpiry') as ElementControl;
            const cardCVV = this.elements.get('CardCVV') as ElementControl;

            // Submit all parts and wait for them to return
            await Promise.all([
                cardExpiry.submit(),
                cardCVV.submit()
            ]);

            this.logger.log('UpdateCard: Submit Successful', LogLevel.INFO);

            return true;
        } catch (e) {
            this.logger.log('UpdateCard: Submit failed', LogLevel.INFO);
            return false;
        }
    }

    public async complete(): Promise<any> {
        this.logger.log(`UpdateCard: Completing card capture action`, LogLevel.INFO);
        try {
            const response = await this.elementsService.completeAction('update-card', this.actionConfig.sessionId, this.actionConfig.actionId);

            this.logger.log('UpdateCard: Complete Successful', LogLevel.INFO);

            return response;
        } catch (e) {
            this.logger.log('UpdateCard: Complete failed', LogLevel.INFO);

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

            this.logger.log('UpdateCard: Clear Successful', LogLevel.INFO);

            return true;
        } catch(ex) {
            this.logger.log('UpdateCard: Clear failed', LogLevel.INFO);

            return false;
        }
    }
}