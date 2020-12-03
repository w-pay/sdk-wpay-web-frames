import "reflect-metadata";
import { Container } from "inversify";

import { ServiceTypes } from '../services';
import ElementsService from '../services/elementsService';

import IElementsService from '../services/types/IElementsService';
import CaptureCard from '../actions/captureCard';

import { ActionTypes } from '../actions';
import ICaptureCard from '../actions/types/ICaptureCard';
import ILoggingService from '../services/types/ILoggingService';
import LoggingService from '../services/loggingService';
import IHttpService from '../services/types/IHttpService';
import HttpService from '../services/httpService';
import IStepUp from '../actions/types/IStepUp';
import StepUp from '../actions/stepUp';
import IUpdateCard from '../actions/types/IUpdateCard';
import UpdateCard from '../actions/updateCard';

// Setup the IOC container
function create() {
    const myContainer = new Container();

    // Bind symbols for services
    myContainer.bind<ILoggingService>(ServiceTypes.LoggingService).to(LoggingService);
    myContainer.bind<IElementsService>(ServiceTypes.ElementsService).to(ElementsService);
    myContainer.bind<IHttpService>(ServiceTypes.HttpService).to(HttpService);

    // Bind the symbols for actions
    myContainer.bind<ICaptureCard>(ActionTypes.CaptureCard).to(CaptureCard);
    myContainer.bind<IStepUp>(ActionTypes.StepUp).to(StepUp);
    myContainer.bind<IUpdateCard>(ActionTypes.UpdateCard).to(UpdateCard);

    return myContainer;
}

export default {create};