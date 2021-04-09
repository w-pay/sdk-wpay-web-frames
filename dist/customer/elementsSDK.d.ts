import 'reflect-metadata';
import { LogLevel } from '../domain/logLevel';
import { Container } from 'inversify';
import { IAction } from 'src/actions/types/IAction';
export default class ElementsSDK {
    myContainer: Container;
    constructor(apiKey: string, authToken: string, apiBase?: string, logLevel?: LogLevel);
    createAction(actionType: symbol, props?: any): IAction;
}
