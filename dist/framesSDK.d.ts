import 'reflect-metadata';
import { Container } from 'inversify';
import { IAction } from './actions/types/IAction';
export default class FramesSDK {
    myContainer: Container;
    constructor(sdkOptions: any);
    createAction(actionType: symbol, actionOptions?: any): IAction;
}
