import 'reflect-metadata';
import { Container } from 'inversify';
import { IAction } from './actions/types/IAction';
import IActionOptions from './domain/IActionOptions';
export default class FramesSDK {
    myContainer: Container;
    constructor(sdkOptions: any);
    createAction(actionType: symbol, actionOptions?: IActionOptions): IAction;
}
