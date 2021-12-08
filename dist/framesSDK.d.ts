import 'reflect-metadata';
import { Container } from 'inversify';
import IActionOptions from './domain/IActionOptions';
import { ActionType, IFramesSDK } from './domain/IFramesSDK';
import { ActionTypes } from './actions';
export default class FramesSDK implements IFramesSDK {
    myContainer: Container;
    constructor(sdkOptions: any);
    createAction<T extends ActionTypes>(actionType: T, actionOptions?: IActionOptions): ActionType<T>;
}
