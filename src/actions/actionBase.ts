import { IAction } from 'src/actions/types/IAction';
import ElementControl from '../controls/elementControl';
import { inject, injectable } from 'inversify';
import { ServiceTypes } from '../services';
import IActionResponse from './types/IActionResponse';
import IElementsService from 'src/services/types/IElementsService';
import ILoggingService from 'src/services/types/ILoggingService';``

@injectable()
export default abstract class ActionBase implements IAction {
    public actionConfig!: IActionResponse;
    public props: any;
    public elements = new Map<string, ElementControl>();
    
    protected elementsService!: IElementsService;
    public logger!: ILoggingService;

    constructor(
        @inject(ServiceTypes.ElementsService) elementsService: IElementsService,
        @inject(ServiceTypes.LoggingService) logger: ILoggingService
    ) {
        this.elementsService = elementsService;
        this.logger = logger;
    }

    public errors(): any[] {
        let errors: any[] = [];

        this.elements.forEach((element => {
            if (element.error) {
                let errorObject = element.error;
                errors.push(errorObject.error);
            }
        }));
        
        return errors;
    }

    public removeElements() {
        this.elements.forEach((element) => {
            element.containerElement.remove();
        });

        this.elements.clear();
    }

    public createElement(elementType: string, targetElementId: string, options: any = {}): void {
        // Get a handle to the target element to ensure it exists
        let targetElement = document.getElementById(targetElementId);
        if (!targetElement) throw new Error("Target element not found");

        let src = `${this.actionConfig.URL}?actionId=${this.actionConfig.actionId}&type=${elementType}`;

        // Tack logLevel onto options
        if (options) {
            options.logLevel = this.logger.getLevel()
        } else {
            options = {
                logLevel: this.logger.getLevel()
            }
        }

        // If options have been supplied, encode them and attach them to the frame URL
        if (options) {
            let encodedOptions = encodeURIComponent(JSON.stringify(options));
            src += `&options=${encodedOptions}`;
        }

        // Create container element and attach some standard classes that can be used for styling
        const container = document.createElement('div');
        container.classList.add('woolies-element', 'element-container');

        // Create the IFrame and attach it to the container
        var iFrame = document.createElement("iframe") as HTMLIFrameElement;
        iFrame.src = src;
        iFrame.frameBorder = "0";
        iFrame.scrolling = "no";
        iFrame.setAttribute("style", `width: 100%; height: ${options?.height || "22px"};`);

        container.appendChild(iFrame);

        // Create a new element control for managing the frame content moving forward
        let elementControl = new ElementControl(elementType, container, iFrame, this.logger);
        this.elements.set(elementType, elementControl);
        
        // Add the container to the target element
        targetElement.appendChild(container);
    }
}