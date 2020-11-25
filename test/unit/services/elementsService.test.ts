import "reflect-metadata";

import HttpService from '../../../src/services/httpService';
import LoggingService from "../../../src/services/loggingService";
import ElementsService from "../../../src/services/elementsService";
import { LogLevel } from "../../../src/domain/logLevel";

jest.mock('../../../src/services/httpService');

const loggingService = new LoggingService(LogLevel.DEBUG);

describe('elementsService', () => {
    it ('can intialise an action', async () => {
        const mockResponse = (url: string, options: any): Promise<any> => {
            return Promise.resolve({ 
                json: jest.fn(async (): Promise<any> => { 
                    return {
                        URL: 'mockURL',
                        sessionId: '12345'
                    };
                })
            });
        };
        HttpService.prototype.fetch = jest.fn(mockResponse);

        const mockHttpService = new HttpService(loggingService);
        
        const elementsService = new ElementsService("API_BASE", mockHttpService);
        const elementsResponse = await elementsService.initialiseAction('capture-card');

        expect(elementsResponse).toEqual({
            url: 'mockURL',
            sessionId: '12345'
        })
    })

    it ('can complete an action', async () => {
        const mockResponse = (url: string, options: any): Promise<any> => {
            return Promise.resolve();
        };
        HttpService.prototype.fetch = jest.fn(mockResponse);

        const mockHttpService = new HttpService(loggingService);
        const elementsService = new ElementsService("API_BASE", mockHttpService);
        
        await elementsService.completeAction('capture-card', '123456');
    })
})