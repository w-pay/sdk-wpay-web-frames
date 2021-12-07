import container from "../../../src/container";
import { ActionTypeSymbols } from "../../../src/actions";
import FramesService from '../../../src/services/framesService';
import { injectable, decorate } from 'inversify';
import CaptureCard from '../../../src/actions/captureCard';
import FrameControl from '../../../src/controls/framesControl';
import { LogLevel } from '../../../src/domain/logLevel';

// jest.mock('../../../src/services/framesService');
// jest.mock('../../../src/controls/frameControl');

jest.mock('../../../src/resources/songbird-staging', () => jest.fn());
jest.mock('../../../src/resources/songbird-production', () => jest.fn());

//decorate(injectable(), FramesService);

interface FramesServiceMock extends FramesService {
    mockResolvedValue: Function
    mockRejectedValue: Function
}

const myContainer = container.create();
myContainer.bind('logLevel').toConstantValue(LogLevel.DEBUG);
myContainer.bind<string>("apiBase").toConstantValue("http://localhost:8080");   
myContainer.bind<string>("authToken").toConstantValue("TOKEN");  
myContainer.bind<string>("apiKey").toConstantValue("API_KEY");  

describe("CaptureCard - Multi", () => {

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    it('can be constructed', () => {
        const action = myContainer.get<any>(ActionTypeSymbols.CaptureCard);

        expect(action).toBeInstanceOf(CaptureCard);
    });
    
    it('can be started', async () => {
        
        FramesService.prototype.initialiseAction = jest.fn().mockImplementation(() => {
            return {
                url: 'mockURL',
                sessionId: '12345'
            };
        })

        const action = myContainer.get<any>(ActionTypeSymbols.CaptureCard);

        await action.start();
    });

    it('can create elements', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        const action = myContainer.get<any>(ActionTypeSymbols.CaptureCard);
        await action.start();

        expect(baseElement.children.length).toEqual(0);

        action.createFramesControl('CardNo', 'cardCapturePanel');
        action.createFramesControl('CardExpiry', 'cardCapturePanel');
        action.createFramesControl('CardCVV', 'cardCapturePanel');

        expect(baseElement.children.length).toEqual(3);
    });

    it('can clear elements', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        const action = myContainer.get<any>(ActionTypeSymbols.CaptureCard);
        await action.start();

        action.createFramesControl('CardNo', 'cardCapturePanel');
        action.createFramesControl('CardExpiry', 'cardCapturePanel');
        action.createFramesControl('CardCVV', 'cardCapturePanel');

        action.clear();
    });

    it('can be validated - success', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        FrameControl.prototype.validate = jest.fn().mockImplementation(() => {
            return Promise.resolve(true);
        });

        const action = myContainer.get<any>(ActionTypeSymbols.CaptureCard);
        await action.start();

        action.createFramesControl('CardNo', 'cardCapturePanel');
        action.createFramesControl('CardExpiry', 'cardCapturePanel');
        action.createFramesControl('CardCVV', 'cardCapturePanel');
        
        //Validate no longer returns a value, ensure that the promise resolves without error
        await expect(action.validate()).resolves.not.toThrow();
    });

    it('can be validated - fail', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        FrameControl.prototype.validate = jest.fn().mockImplementation(() => {
            return Promise.reject();
        });

        const action = myContainer.get<any>(ActionTypeSymbols.CaptureCard);
        await action.start();

        action.createFramesControl('CardNo', 'cardCapturePanel');
        action.createFramesControl('CardExpiry', 'cardCapturePanel');
        action.createFramesControl('CardCVV', 'cardCapturePanel');
        
        //Validate no longer returns a value, ensure that the promise resolves without error
        await expect(action.validate()).rejects.toEqual(undefined);
    });

    it('can be submitted - success', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        FrameControl.prototype.submit = FrameControl.prototype.validate = jest.fn().mockImplementation(() => {
            return Promise.resolve(true);
        });

        const action = myContainer.get<any>(ActionTypeSymbols.CaptureCard);
        await action.start();

        action.createFramesControl('CardNo', 'cardCapturePanel');
        action.createFramesControl('CardExpiry', 'cardCapturePanel');
        action.createFramesControl('CardCVV', 'cardCapturePanel');

        //Submit no longer returns a value, ensure that the promise resolves without error
        await expect(action.submit()).resolves.not.toThrow();
    });

    it('can be submitted - fail', async () => {
        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        FrameControl.prototype.submit = jest.fn().mockImplementation(() => {
            return Promise.reject();
        });

        const action = myContainer.get<any>(ActionTypeSymbols.CaptureCard);
        await action.start();

        action.createFramesControl('CardNo', 'cardCapturePanel');
        action.createFramesControl('CardExpiry', 'cardCapturePanel');
        action.createFramesControl('CardCVV', 'cardCapturePanel');
        
        //Submit no longer returns a value, ensure that the promise resolves without error
        await expect(action.submit()).rejects.toEqual(undefined);
    });

    it('can be completed', async () => {
        FramesService.prototype.completeAction = jest.fn().mockImplementation(() => {
            return Promise.resolve({ message: '' });
        });

        const baseElement = document.createElement('div');
        baseElement.id = "cardCapturePanel";
        document.body.appendChild(baseElement);

        const action = myContainer.get<any>(ActionTypeSymbols.CaptureCard);
        action.options = { save: true };
        await action.start();

        action.createFramesControl('CardNo', 'cardCapturePanel');
        action.createFramesControl('CardExpiry', 'cardCapturePanel');
        action.createFramesControl('CardCVV', 'cardCapturePanel');
        
        await action.complete();

        expect(FramesService.prototype.completeAction).toHaveBeenCalled();
    });
})
