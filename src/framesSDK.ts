import 'reflect-metadata';

import container from "./container";

import { LogLevel } from './domain/logLevel';
import { Container } from 'inversify';
import IActionOptions from './domain/IActionOptions';
import { ActionType, IFramesSDK } from './domain/IFramesSDK';
import { ActionTypeSymbols, ActionTypes } from './actions';

var myContainer: Container

export default class FramesSDK implements IFramesSDK {
    myContainer = container.create();

    constructor(sdkOptions: any) {
        this.myContainer = container.create();

        this.myContainer.bind<string>("authToken").toConstantValue(sdkOptions.authToken);
        this.myContainer.bind<string>("apiKey").toConstantValue(sdkOptions.apiKey);
        this.myContainer.bind<string>("apiBase").toConstantValue(sdkOptions.apiBase || "http://localhost:3000");
        this.myContainer.bind<LogLevel>("logLevel").toConstantValue(sdkOptions.logLevel || LogLevel.NONE);
    }

    public createAction<T extends ActionTypes>(actionType: T, actionOptions: IActionOptions = {}): ActionType<T> {
        const actionTypeSymbol = ActionTypeSymbols[actionType];
        const action = (this.myContainer.get(actionTypeSymbol) as ActionType<T>);
        action.options = actionOptions;
        return action;
    }
}