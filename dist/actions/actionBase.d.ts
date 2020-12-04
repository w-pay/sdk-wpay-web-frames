import { IAction } from 'src/actions/types/IAction';
import ElementControl from '../controls/elementControl';
import IActionResponse from './types/IActionResponse';
import IElementsService from 'src/services/types/IElementsService';
import ILoggingService from 'src/services/types/ILoggingService';
export default abstract class ActionBase implements IAction {
    actionConfig: IActionResponse;
    props: any;
    elements: Map<string, ElementControl>;
    protected elementsService: IElementsService;
    logger: ILoggingService;
    constructor(elementsService: IElementsService, logger: ILoggingService);
    errors(): any[];
    removeElements(): void;
    createElement(elementType: string, targetElementId: string, options?: any): void;
}
