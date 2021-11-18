import { IAction } from 'src/actions/types/IAction';
import FramesControl from '../controls/framesControl';
import IActionResponse from './types/IActionResponse';
import IFramesService from 'src/services/types/IFramesService';
import ILoggingService from 'src/services/types/ILoggingService';
export default abstract class ActionBase implements IAction {
    framesService: IFramesService;
    actionConfig: IActionResponse;
    options: any;
    frames: Map<string, FramesControl>;
    targetElementId: string;
    logger: ILoggingService;
    constructor(framesService: IFramesService, logger: ILoggingService);
    errors(): any[];
    removeElements(): void;
    createFramesControl(framesControlType: string, targetElementId: string, options?: any): void;
}
