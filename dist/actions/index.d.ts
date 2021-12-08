declare const ActionTypeSymbols: {
    CaptureCard: symbol;
    StepUp: symbol;
    UpdateCard: symbol;
    ValidateCard: symbol;
    ValidatePayment: symbol;
};
declare enum ActionTypes {
    CaptureCard = "CaptureCard",
    StepUp = "StepUp",
    UpdateCard = "UpdateCard",
    ValidateCard = "ValidateCard",
    ValidatePayment = "ValidatePayment"
}
export { ActionTypes, ActionTypeSymbols };
