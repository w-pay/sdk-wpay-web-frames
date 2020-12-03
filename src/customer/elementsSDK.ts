import 'reflect-metadata';

import container from "./container";

import IAuthorizationService from '../services/types/IAuthorzationService';
import { LogLevel } from '../domain/logLevel';
import { Container } from 'inversify';
import { IAction } from 'src/actions/types/IAction';

export default class ElementsSDK {

    public authService!: IAuthorizationService;
    public myContainer: Container;

    constructor(apiKey: string, authToken:string, apiBase?: string, logLevel?: LogLevel) {
        this.myContainer = container.create();

        this.myContainer.bind<string>("authToken").toConstantValue(authToken);
        this.myContainer.bind<string>("apiKey").toConstantValue(apiKey);
        this.myContainer.bind<string>("apiBase").toConstantValue(apiBase || "http://localhost:3000");
        this.myContainer.bind<LogLevel>("logLevel").toConstantValue(logLevel || LogLevel.NONE);
    }

    public createAction(actionType: symbol, props?: any) {
        const action: IAction = this.myContainer.get<any>(actionType);
        action.props = props;
        return action;
    }
}