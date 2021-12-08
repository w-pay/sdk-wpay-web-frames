import { IAction } from "../actions/types/IAction";
import IActionOptions from "./IActionOptions";
import ICaptureCard from "../actions/types/ICaptureCard";
import IStepUp from "../actions/types/IStepUp";
import IUpdateCard from "../actions/types/IUpdateCard";
import IValidateCard from "../actions/types/IValidateCard";
import IValidatePayment from "../actions/types/IValidatePayment";
import { ActionTypes } from "../actions";

export type ActionType<T> = 
    T extends ActionTypes.CaptureCard ? ICaptureCard :
    T extends ActionTypes.StepUp ? IStepUp :
    T extends ActionTypes.UpdateCard ? IUpdateCard :
    T extends ActionTypes.ValidateCard ? IValidateCard :
    T extends ActionTypes.ValidatePayment ? IValidatePayment :
    IAction;

export interface IFramesSDK {
    createAction<T extends ActionTypes>(actionType: T, actionOptions?: IActionOptions): ActionType<T>;
}