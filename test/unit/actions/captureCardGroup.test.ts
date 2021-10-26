import container from "../../../src/container";
import { ActionTypes } from "../../../src/actions";
import FramesService from '../../../src/services/framesService';
import { injectable, decorate } from 'inversify';
import CaptureCard from '../../../src/actions/captureCard';
import { LogLevel } from "../../../src/domain/logLevel";
import FramesControl from "../../../src/controls/framesControl";

jest.mock('../../../src/services/framesService');
jest.mock('../../../src/controls/framesControl');

jest.mock('../../../src/resources/songbird-staging', () => jest.fn());
jest.mock('../../../src/resources/songbird-production', () => jest.fn());

decorate(injectable(), FramesService);

const myContainer = container.create();
myContainer.bind('logLevel').toConstantValue(LogLevel.DEBUG);
myContainer.bind<string>("apiBase").toConstantValue("http://localhost:8080");   
myContainer.bind<string>("authToken").toConstantValue("TOKEN");  
myContainer.bind<string>("apiKey").toConstantValue("API_KEY");  

interface FramesServiceMock extends FramesService {
    mockResolvedValue: Function
    mockRejectedValue: Function
}

describe("CaptureCard - Group", () => {

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });
 
    it('can be constructed', () => {
        const action = myContainer.get<any>(ActionTypes.CaptureCard);

        expect(action).toBeInstanceOf(CaptureCard);
    });
    
    it('can be started', async () => {
        
        FramesService.prototype.initialiseAction = jest.fn().mockImplementation(() => {
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

        action.createFramesControl('CardGroup', 'cardCapturePanel');

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

        action.createFramesControl('CardGroup', 'cardCapturePanel', options);

        expect(baseElement.children.length).toEqual(1);
    });

    it('will fail to create element when missing target', async () => {
        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        // try {
        //     expect(action.createFramesControl('CardGroup', 'cardCapturePanel')).toThrow();
        // } catch (ex) {
        //     expect(ex).toEqual('Target element not found');
        // }

        expect(() => action.createFramesControl('CardGroup', 'cardCapturePanel')).toThrow('Target element not found');
    });

    it('can clear elements', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        FramesControl.prototype.validate = jest.fn().mockImplementation(() => {
            return Promise.resolve(true);
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        action.createFramesControl('CardGroup', 'cardCapturePanel');

        await action.clear();
    });

    it('can clear elements - failed', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        const clearReturnValue = {
            "action": "clearElementFailed", 
            "error": "Clear Failed"
        }
        FramesControl.prototype.clear = jest.fn().mockImplementation(() => {
            return Promise.reject(clearReturnValue);
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        action.createFramesControl('CardGroup', 'cardCapturePanel');

        //await expect(action.clear()).toThrow();
        await expect(action.clear()).rejects.toEqual(clearReturnValue);
    });

    it('can be validated', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        FramesControl.prototype.validate = jest.fn().mockImplementation(() => {
            return Promise.resolve(true);
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        expect(baseElement.children.length).toEqual(0);

        await action.createFramesControl('CardGroup', 'cardCapturePanel');

        expect(baseElement.children.length).toEqual(1);
        
        //Validate no longer returns a value, ensure that the promise resolves without error
        await expect(action.validate()).resolves.not.toThrow();
    });

    it('can be submitted', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        FramesControl.prototype.submit = jest.fn().mockImplementation(() => {
            return Promise.resolve(true);
        });

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        await action.start();

        expect(baseElement.children.length).toEqual(0);

        await action.createFramesControl('CardGroup', 'cardCapturePanel');

        expect(baseElement.children.length).toEqual(1);
        
        //Submit no longer returns a value, ensure that the promise resolves without error
        await expect(action.submit()).resolves.not.toThrow();
    });

    it('can be completed', async () => {
        FramesService.prototype.completeAction = jest.fn().mockImplementation(() => {
            return Promise.resolve({ message: '' });
        });

        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        const action = myContainer.get<any>(ActionTypes.CaptureCard);
        action.options = { save: true };
        await action.start();

        expect(baseElement.children.length).toEqual(0);

        await action.createFramesControl('CardGroup', 'cardCapturePanel');

        expect(baseElement.children.length).toEqual(1);

        await action.complete();

        expect(FramesService.prototype.completeAction).toHaveBeenCalled();
    });
})
