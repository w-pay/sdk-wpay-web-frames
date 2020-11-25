import myContainer from "../../../src/customer/container";
import { ActionTypes } from "../../../src/actions";
import ElementsService from '../../../src/services/elementsService';
import { injectable, decorate } from 'inversify';
import CaptureCard from '../../../src/actions/captureCard';
import ElementControl from '../../../src/controls/elementControl';
import { LogLevel } from "../../../src/domain/logLevel";

jest.mock('../../../src/services/elementsService');
jest.mock('../../../src/controls/elementControl');

decorate(injectable(), ElementsService);

myContainer.bind('logLevel').toConstantValue(LogLevel.DEBUG);

interface ElementsServiceMock extends ElementsService {
    mockResolvedValue: Function
    mockRejectedValue: Function
}

describe("CaptureCard - Group", () => {

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    myContainer.bind<string>("apiBase").toConstantValue("http://localhost:8080");    
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

        action.createElement('CardGroup', 'cardCapturePanel');

        expect(baseElement.children.length).toEqual(1);
    });

    it('can create elements with options', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        expect(baseElement.children.length).toEqual(0);

        let options = {
            style: {}
        }

        action.createElement('CardGroup', 'cardCapturePanel', options);

        expect(baseElement.children.length).toEqual(1);
    });

    it('will fail to create element when missing target', async () => {
        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        try {
            expect(action.createElement('CardGroup', 'cardCapturePanel')).toThrow();
        } catch (ex) {
            expect(ex).toEqual('Target element not found');
        }
    });

    it('can clear elements', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        ElementControl.prototype.validate = jest.fn().mockImplementation(() => {
            return Promise.resolve(true);
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        action.createElement('CardGroup', 'cardCapturePanel');

        await action.clear();
    });

    it('can clear elements - failed', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        ElementControl.prototype.clear = jest.fn().mockImplementation(() => {
            return Promise.reject({
                "action": "clearElementFailed", 
                "error": "Clear Failed"
            });
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        action.createElement('CardGroup', 'cardCapturePanel');

        expect(await action.clear()).toBeFalsy();
    });

    it('can be validated', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        ElementControl.prototype.validate = jest.fn().mockImplementation(() => {
            return Promise.resolve(true);
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        expect(baseElement.children.length).toEqual(0);

        await action.createElement('CardGroup', 'cardCapturePanel');

        expect(baseElement.children.length).toEqual(1);
        
        let result = await action.validate();

        expect(result).toEqual(true);
    });

    it('can be submitted', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        ElementControl.prototype.submit = jest.fn().mockImplementation(() => {
            return Promise.resolve(true);
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        expect(baseElement.children.length).toEqual(0);

        await action.createElement('CardGroup', 'cardCapturePanel');

        expect(baseElement.children.length).toEqual(1);
        
        let result = await action.submit();
        expect(result).toEqual(true);
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

        expect(baseElement.children.length).toEqual(0);

        await action.createElement('CardGroup', 'cardCapturePanel');

        expect(baseElement.children.length).toEqual(1);
        
        await action.complete();

        expect(ElementsService.prototype.completeAction).toHaveBeenCalled();
    });
})
