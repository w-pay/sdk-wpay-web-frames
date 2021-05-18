import { IAction } from 'src/actions/types/IAction';
import FramesControl from '../controls/framesControl';
import { inject, injectable } from 'inversify';
import { ServiceTypes } from '../services';
import IActionResponse from './types/IActionResponse';
import IFramesService from 'src/services/types/IFramesService';
import ILoggingService from 'src/services/types/ILoggingService';

@injectable()
export default abstract class ActionBase implements IAction {
    public actionConfig!: IActionResponse;
    public options: any;
    public frames = new Map<string, FramesControl>();
    
    public logger!: ILoggingService;

    constructor(
        @inject(ServiceTypes.FramesService) public framesService: IFramesService,
        @inject(ServiceTypes.LoggingService) logger: ILoggingService
    ) {
        this.logger = logger;
    }

    public errors(): any[] {
        let errors: any[] = [];

        this.frames.forEach((control => {
            if (control.error) {
                let errorObject = control.error;
                errors.push(errorObject.error);
            }
        }));
        
        return errors;
    }

    public removeElements() {
        this.frames.forEach(control => {
            control.containerElement.remove();
        });

        this.frames.clear();
    }

    public createFramesControl(framesControlType: string, targetElementId: string, options: any = {}): void {
        // Get a handle to the target element to ensure it exists
        let targetElement = document.getElementById(targetElementId);
        if (!targetElement) throw new Error("Target element not found");

        let src = `${this.actionConfig.URL}?actionId=${this.actionConfig.actionId}&type=${framesControlType}`;

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
        var iFrame = document.createElement("iframe");
        iFrame.src = src;
        iFrame.frameBorder = "0";
        iFrame.scrolling = "no";
        iFrame.setAttribute("style", `width: 100%; height: ${options?.height || "22px"};`);

        container.appendChild(iFrame);

        // Create a new frames control for managing the frame content moving forward
        let framesControl = new FramesControl(framesControlType, container, iFrame, this.logger);
        this.frames.set(framesControlType, framesControl);
        
        // Add the container to the target element
        targetElement.appendChild(container);
    }
}