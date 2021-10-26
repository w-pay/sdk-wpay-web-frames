import "reflect-metadata";

import HttpService from '../../../src/services/httpService';
import LoggingService from "../../../src/services/loggingService";
import FramesService from "../../../src/services/framesService";
import { LogLevel } from "../../../src/domain/logLevel";

jest.mock('../../../src/services/httpService');

const loggingService = new LoggingService(LogLevel.DEBUG);

describe('framesService', () => {
    it ('can intialise an action', async () => {
        const mockResponse = (url: string, options: any): Promise<any> => {
            return Promise.resolve({
                data: {
                    data: Promise.resolve({
                        URL: 'mockURL',
                        sessionId: '12345'
                    })
                }
            });
        };
        HttpService.prototype.fetch = jest.fn(mockResponse);

        const mockHttpService = new HttpService(loggingService);
        
        const framesService = new FramesService("AUTH_TOKEN", "API_BASE", "API_KEY", mockHttpService);
        const framesResponse = await framesService.initialiseAction('capture-card', {});

        expect(framesResponse).toEqual({
            URL: 'mockURL',
            sessionId: '12345'
        })
    })

    it ('can complete an action', async () => {
        const mockResponse = (url: string, options: any): Promise<any> => {
            return Promise.resolve({ data: { data: {} }});
        };
        HttpService.prototype.fetch = jest.fn(mockResponse);

        const mockHttpService = new HttpService(loggingService);
        const framesService = new FramesService("AUTH_TOKEN", "API_BASE", "API_KEY", mockHttpService);
        
        await framesService.completeAction('capture-card', 'sessionId', '123456', {}, []);
    })
})