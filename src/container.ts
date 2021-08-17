import "reflect-metadata";
import { Container } from "inversify";

import { ServiceTypes } from './services';
import FramesService from './services/framesService';

import IFramesService from './services/types/IFramesService';
import CaptureCard from './actions/captureCard';

import { ActionTypes } from './actions';
import ICaptureCard from './actions/types/ICaptureCard';
import ILoggingService from './services/types/ILoggingService';
import LoggingService from './services/loggingService';
import IHttpService from './services/types/IHttpService';
import HttpService from './services/httpService';
import IStepUp from './actions/types/IStepUp';
import StepUp from './actions/stepUp';
import IUpdateCard from './actions/types/IUpdateCard';
import IValidateCard from './actions/types/IValidateCard';
import IValidatePayment from './actions/types/IValidatePayment';
import UpdateCard from './actions/updateCard';
import ValidateCard from "./actions/validateCard";
import ValidatePayment from "./actions/validatePayment";
import IThreeDSService from "./services/types/IThreeDSService";
import ThreeDSService from "./services/threeDSService";

// Setup the IOC container
function create() {
    const myContainer = new Container();

    // Bind symbols for services
    myContainer.bind<ILoggingService>(ServiceTypes.LoggingService).to(LoggingService);
    myContainer.bind<IFramesService>(ServiceTypes.FramesService).to(FramesService);
    myContainer.bind<IThreeDSService>(ServiceTypes.ThreeDSService).to(ThreeDSService);
    myContainer.bind<IHttpService>(ServiceTypes.HttpService).to(HttpService);

    // Bind the symbols for actions
    myContainer.bind<ICaptureCard>(ActionTypes.CaptureCard).to(CaptureCard);
    myContainer.bind<IStepUp>(ActionTypes.StepUp).to(StepUp);
    myContainer.bind<IUpdateCard>(ActionTypes.UpdateCard).to(UpdateCard);
    myContainer.bind<IValidateCard>(ActionTypes.ValidateCard).to(ValidateCard);
    myContainer.bind<IValidatePayment>(ActionTypes.ValidatePayment).to(ValidatePayment);

    return myContainer;
}

export default {create};