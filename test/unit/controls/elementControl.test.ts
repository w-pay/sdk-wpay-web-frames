import ElementControl from '../../../src/controls/elementControl';
import LoggingService from '../../../src/services/loggingService';
import { LogLevel } from '../../../src/domain/logLevel';

describe('elementControl', () => {
    it ('can be constructed', () => {
        const frameElement = document.createElement("iframe");
        const containerElement = document.createElement("div");

        const elementControl = new ElementControl('CardGroup', containerElement, frameElement, new LoggingService(LogLevel.DEBUG));
    })

    it ('can handle errors', () => {
        const frameElement = document.createElement("iframe");
        const containerELement = document.createElement("div");

        const elementControl = new ElementControl('CardGroup', containerELement, frameElement, new LoggingService(LogLevel.DEBUG));

        let error = elementControl.error;

        expect(error).toEqual(undefined);

        elementControl.error = "Some error";

        expect(containerELement.classList).toContain('error');
        expect(elementControl.isValid()).toBeFalsy();

        elementControl.error = undefined;

        expect(containerELement.classList).not.toContain('error');
        expect(elementControl.isValid()).toBeTruthy();
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

        const elementControl = new ElementControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        await elementControl.clear();
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

        const elementControl = new ElementControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        try {
            expect(await elementControl.clear()).toThrow();
        } catch (ex) {
            delete elementControl.error.id;
            expect(elementControl.error).toEqual(
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

        const elementControl = new ElementControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        await elementControl.validate();

        expect(elementControl.isValid()).toBeTruthy();
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

        const elementControl = new ElementControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        try {
            expect(await elementControl.validate()).toThrow();
        } catch (ex) {
            expect(elementControl.isValid()).toBeFalsy();
            delete elementControl.error.id;
            expect(elementControl.error).toEqual(
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

        const elementControl = new ElementControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        await elementControl.submit();

        expect(elementControl.isValid()).toBeTruthy();
    })

    it ('can submit - failure', async () => {
        const iframeElement: HTMLIFrameElement = document.createElement("iframe");
        const containerElement: HTMLDivElement = document.createElement("div");

        const elementControlNoMount = new ElementControl('CardGroup', containerElement, iframeElement, new LoggingService(LogLevel.DEBUG));
        
        try {
            expect(await elementControlNoMount.submit()).toThrow();
        } catch(e) {
            expect(elementControlNoMount.isValid()).toBeFalsy();
            expect(elementControlNoMount.error).toEqual(
                {
                    "action": "elementActionFailed", 
                    "error": "IFrame not mounted to DOM"
                }
            );
        }
    })

})