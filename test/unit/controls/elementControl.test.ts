import FramesControl from '../../../src/controls/framesControl';
import LoggingService from '../../../src/services/loggingService';
import { LogLevel } from '../../../src/domain/logLevel';

describe('framesControl', () => {
    it ('can be constructed', () => {
        const frameElement = document.createElement("iframe");
        const containerElement = document.createElement("div");

        const framesControl = new FramesControl('CardGroup', containerElement, frameElement, new LoggingService(LogLevel.DEBUG));
    })

    it ('can handle errors', () => {
        const frameElement = document.createElement("iframe");
        const containerELement = document.createElement("div");

        const framesControl = new FramesControl('CardGroup', containerELement, frameElement, new LoggingService(LogLevel.DEBUG));

        let error = framesControl.error;

        expect(error).toEqual(undefined);

        framesControl.error = "Some error";

        expect(containerELement.classList).toContain('error');
        expect(framesControl.isValid()).toBeFalsy();

        framesControl.error = undefined;

        expect(containerELement.classList).not.toContain('error');
        expect(framesControl.isValid()).toBeTruthy();
    })

    it ('can clear - success', async () => {
        const iframeElement: HTMLIFrameElement = document.createElement("iframe");
        iframeElement.src = "http://somedomain.test.com.au/";

        const containerElement: HTMLDivElement = document.createElement("div");
        
        containerElement.appendChild(iframeElement);
        document.body.appendChild(containerElement);

        if (!iframeElement.contentWindow) fail();

        iframeElement.contentWindow.addEventListener('message', (m) => {
            switch(m.data.action) {
                case 'clearElement':
                    window.postMessage({ 
                        id: m.data.id,
                        element: 'CardGroup',
                        action: 'clearElementComplete' }, '*');
                    break;
            }
        });

        const framesControl = new FramesControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        await framesControl.clear();
    })

    it ('can clear - failure', async () => {
        const iframeElement: HTMLIFrameElement = document.createElement("iframe");
        iframeElement.src = "http://somedomain.test.com.au/some/path";

        const containerElement: HTMLDivElement = document.createElement("div");
        
        containerElement.appendChild(iframeElement);
        document.body.appendChild(containerElement);

        if (!iframeElement.contentWindow) fail();

        iframeElement.contentWindow.addEventListener('message', (m) => {
            switch(m.data.action) {
                case 'clearElement':
                    window.postMessage({
                        id: m.data.id,
                        element: 'CardGroup',
                        action: 'clearElementFailed',
                        error: 'Clear Failed'
                    }, '*');
                    break;
            }
        });

        const framesControl = new FramesControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        try {
            expect(await framesControl.clear()).toThrow();
        } catch (ex) {
            delete framesControl.error.id;
            expect(framesControl.error).toEqual(
                {
                    "element": 'CardGroup',
                    "action": "clearElementFailed", 
                    "error": "Clear Failed"
                }
            );
        }
    })

    it ('can validate - success', async () => {
        const iframeElement: HTMLIFrameElement = document.createElement("iframe");
        iframeElement.src = "http://somedomain.test.com.au/";

        const containerElement: HTMLDivElement = document.createElement("div");
        
        containerElement.appendChild(iframeElement);
        document.body.appendChild(containerElement);

        if (!iframeElement.contentWindow) fail();

        iframeElement.contentWindow.addEventListener('message', (m) => {
            switch(m.data.action) {
                case 'validateElement':
                    window.postMessage({ 
                        id: m.data.id,
                        element: 'CardGroup',
                        action: 'validateElementComplete' }, '*');
                    break;
            }
        });

        const framesControl = new FramesControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        await framesControl.validate();

        expect(framesControl.isValid()).toBeTruthy();
    })

    it ('can validate - failure', async () => {
        const iframeElement: HTMLIFrameElement = document.createElement("iframe");
        iframeElement.src = "http://somedomain.test.com.au/";

        const containerElement: HTMLDivElement = document.createElement("div");
        
        containerElement.appendChild(iframeElement);
        document.body.appendChild(containerElement);

        if (!iframeElement.contentWindow) fail();

        iframeElement.contentWindow.addEventListener('message', (m) => {
            switch(m.data.action) {
                case 'validateElement':
                    window.postMessage({
                        id: m.data.id,
                        element: 'CardGroup',
                        action: 'validateElementFailed',
                        error: 'Validation Failed'
                    }, '*');
                    break;
            }
        });

        const framesControl = new FramesControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        try {
            expect(await framesControl.validate()).toThrow();
        } catch (ex) {
            expect(framesControl.isValid()).toBeFalsy();
            delete framesControl.error.id;
            expect(framesControl.error).toEqual(
                {
                    "element": 'CardGroup',
                    "action": "validateElementFailed", 
                    "error": "Validation Failed"
                }
            );
        }
    })

    it ('can submit - success', async () => {
        const iframeElement: HTMLIFrameElement = document.createElement("iframe");
        iframeElement.src = "http://somedomain.test.com.au/";

        const containerElement: HTMLDivElement = document.createElement("div");
        
        containerElement.appendChild(iframeElement);
        document.body.appendChild(containerElement);

        if (!iframeElement.contentWindow) fail();

        iframeElement.contentWindow.addEventListener('message', (m) => {
            switch(m.data.action) {
                case 'submitElement':
                    window.postMessage({ 
                        id: m.data.id,
                        element: 'CardGroup',
                        action: 'submitElementComplete' }, '*');
                    break;
            }
        });

        const framesControl = new FramesControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        await framesControl.submit();

        expect(framesControl.isValid()).toBeTruthy();
    })

    it ('can submit - failure', async () => {
        const iframeElement: HTMLIFrameElement = document.createElement("iframe");
        const containerElement: HTMLDivElement = document.createElement("div");

        const framesControlNoMount = new FramesControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        
        try {
            expect(await framesControlNoMount.submit()).toThrow();
        } catch(e) {
            expect(framesControlNoMount.isValid()).toBeFalsy();
            expect(framesControlNoMount.error).toEqual(
                {
                    "action": "frameActionFailed", 
                    "error": "IFrame not mounted to DOM"
                }
            );
        }
    })

})