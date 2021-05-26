import 'reflect-metadata';

import container from "./container";

import { LogLevel } from './domain/logLevel';
import { Container } from 'inversify';
import { IAction } from './actions/types/IAction';

var myContainer: Container

export default class FramesSDK {
    myContainer = container.create();

    constructor(sdkOptions: any) {
        this.myContainer = container.create();

        this.myContainer.bind<string>("authToken").toConstantValue(sdkOptions.authToken);
        this.myContainer.bind<string>("apiKey").toConstantValue(sdkOptions.apiKey);
        this.myContainer.bind<string>("apiBase").toConstantValue(sdkOptions.apiBase || "http://localhost:3000");
        this.myContainer.bind<LogLevel>("logLevel").toConstantValue(sdkOptions.logLevel || LogLevel.NONE);
    }

    public createAction(actionType: symbol, actionOptions: any = {}) {
        const action: IAction = this.myContainer.get<any>(actionType);
        action.options = actionOptions;
        return action;
    }
}