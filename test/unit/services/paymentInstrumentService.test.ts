import HttpService from "../../../src/services/httpService";
import PaymentInstrumentService from "../../../src/services/paymentInstrumentService";
import LoggingService from "../../../src/services/loggingService";
import { LogLevel } from "../../../src/domain/logLevel";

const loggingService = new LoggingService(LogLevel.DEBUG);

jest.mock("../../../src/services/httpService");

describe('paymentInstrumentService', () => {
    it('listAll(): can list all payment instruments', async () => {
        const mockResponse = (url: string, options: any): Promise<any> => {
            return Promise.resolve({ 
                json: jest.fn(async (): Promise<any> => { 
                    return { 
                        data: [ 
                            { paymentInstrumentId: 1234565 } 
                        ]
                    };
                })
            });
        };
        HttpService.prototype.fetch = jest.fn(mockResponse);

        const mockHttpService = new HttpService(loggingService);
        const paymentInstrumentService = new PaymentInstrumentService("TOKEN", "API_BASE", "API_KEY", loggingService, mockHttpService);

        const paymentInstruments = await paymentInstrumentService.listAll(true);
        expect(paymentInstruments).toHaveLength(1);
    })

    it('listAll(): throws on network failures', async () => {
        const mockResponse = (url: string, options: any): Promise<any> => {
            return Promise.reject('Network Error');
        };
        HttpService.prototype.fetch = jest.fn(mockResponse);
        const mockHttpService = new HttpService(loggingService);

        try {
            const paymentInstrumentService = new PaymentInstrumentService("TOKEN", "API_BASE", "API_KEY", loggingService, mockHttpService);
            const paymentInstruments = await paymentInstrumentService.listAll(true);
        } catch (e) {
            expect(e).toEqual('Network Error');
        }
    })

    it('remove(): throws on network failures', async () => {
        const mockResponse = (url: string, options: any): Promise<any> => {
            return Promise.resolve();
        };
        HttpService.prototype.fetch = jest.fn(mockResponse);
        const mockHttpService = new HttpService(loggingService);

        const paymentInstrumentService = new PaymentInstrumentService("TOKEN", "API_BASE", "API_KEY", loggingService, mockHttpService);
        await paymentInstrumentService.remove('123456', true);
    })
})