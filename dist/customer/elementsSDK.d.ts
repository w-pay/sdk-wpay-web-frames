import 'reflect-metadata';
import IAuthorizationService from '../services/types/IAuthorzationService';
import { LogLevel } from '../domain/logLevel';
import { Container } from 'inversify';
import { IAction } from 'src/actions/types/IAction';
export default class ElementsSDK {
    authService: IAuthorizationService;
    myContainer: Container;
    constructor(apiKey: string, authToken: string, apiBase?: string, logLevel?: LogLevel);
    createAction(actionType: symbol): IAction;
}
