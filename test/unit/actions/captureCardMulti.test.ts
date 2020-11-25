import myContainer from "../../../src/customer/container";
import { ActionTypes } from "../../../src/actions";
import ElementsService from '../../../src/services/elementsService';
import { injectable, decorate } from 'inversify';
import CaptureCard from '../../../src/actions/captureCard';
import ElementControl from '../../../src/controls/elementControl';
import { LogLevel } from '../../../src/domain/logLevel';

jest.mock('../../../src/services/elementsService');
jest.mock('../../../src/controls/elementControl');

decorate(injectable(), ElementsService);

interface ElementsServiceMock extends ElementsService {
    mockResolvedValue: Function
    mockRejectedValue: Function
}

describe("CaptureCard - Multi", () => {

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    myContainer.bind<string>("apiBase").toConstantValue("http://localhost:8080/card-capture");    
    myContainer.bind('logLevel').toConstantValue(LogLevel.DEBUG);

    it('can be constructed', () => {
        const action = myContainer.get<any>(ActionTypes.CaptureCard);

        expect(action).toBeInstanceOf(CaptureCard);
    });
    
    it('can be started', async () => {
        
        ElementsService.prototype.initialiseAction = jest.fn().mockImplementation(() => {
            return {
                url: 'mockURL',
                sessionId: '12345'
            };
        })

        const action = myContainer.get<any>(ActionTypes.CaptureCard);

        await action.start();
    });

    it('can create elements', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        expect(baseElement.children.length).toEqual(0);

        action.createElement('CardNo', 'cardCapturePanel');
        action.createElement('CardExpiry', 'cardCapturePanel');
        action.createElement('CardCVV', 'cardCapturePanel');

        expect(baseElement.children.length).toEqual(3);
    });

    it('can clear elements', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        action.createElement('CardNo', 'cardCapturePanel');
        action.createElement('CardExpiry', 'cardCapturePanel');
        action.createElement('CardCVV', 'cardCapturePanel');

        action.clear();
    });

    it('can be validated - success', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        ElementControl.prototype.validate = jest.fn().mockImplementation(() => {
            return Promise.resolve(true);
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        action.createElement('CardNo', 'cardCapturePanel');
        action.createElement('CardExpiry', 'cardCapturePanel');
        action.createElement('CardCVV', 'cardCapturePanel');
        
        let result = await action.validate();

        expect(result).toEqual(true);
    });

    it('can be validated - fail', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        ElementControl.prototype.validate = jest.fn().mockImplementation(() => {
            return Promise.reject();
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        action.createElement('CardNo', 'cardCapturePanel');
        action.createElement('CardExpiry', 'cardCapturePanel');
        action.createElement('CardCVV', 'cardCapturePanel');
        
        let result = await action.validate();

        expect(result).toEqual(false);
    });

    it('can be submitted - success', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        ElementControl.prototype.submit = ElementControl.prototype.validate = jest.fn().mockImplementation(() => {
            return Promise.resolve(true);
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        action.createElement('CardNo', 'cardCapturePanel');
        action.createElement('CardExpiry', 'cardCapturePanel');
        action.createElement('CardCVV', 'cardCapturePanel');
        
        let result = await action.submit();
        expect(result).toEqual(true);
    });

    it('can be submitted - fail', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        ElementControl.prototype.submit = jest.fn().mockImplementation(() => {
            return Promise.reject();
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        action.createElement('CardNo', 'cardCapturePanel');
        action.createElement('CardExpiry', 'cardCapturePanel');
        action.createElement('CardCVV', 'cardCapturePanel');
        
        let result = await action.submit();
        expect(result).toEqual(false);
    });

    it('can be completed', async () => {
        ElementsService.prototype.completeAction = jest.fn().mockImplementation(() => {
            return Promise.resolve();
        });

        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        action.createElement('CardNo', 'cardCapturePanel');
        action.createElement('CardExpiry', 'cardCapturePanel');
        action.createElement('CardCVV', 'cardCapturePanel');
        
        await action.complete();

        expect(ElementsService.prototype.completeAction).toHaveBeenCalled();
    });
})
