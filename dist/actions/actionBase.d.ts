import { IAction } from 'src/actions/types/IAction';
import FramesControl from '../controls/framesControl';
import IActionResponse from './types/IActionResponse';
import IElementsService from 'src/services/types/IElementsService';
import ILoggingService from 'src/services/types/ILoggingService';
export default abstract class ActionBase implements IAction {
    actionConfig: IActionResponse;
    props: any;
    frames: Map<string, FramesControl>;
    protected elementsService: IElementsService;
    logger: ILoggingService;
    constructor(elementsService: IElementsService, logger: ILoggingService);
    errors(): any[];
    removeElements(): void;
    createFramesControl(framesControlType: string, targetElementId: string, options?: any): void;
}
