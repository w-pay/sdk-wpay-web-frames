const ActionTypeSymbols = {
    CaptureCard: Symbol.for("CaptureCard"),
    StepUp: Symbol.for("StepUp"),
    UpdateCard: Symbol.for("UpdateCard"),
    ValidateCard: Symbol.for("ValidateCard"),
    ValidatePayment: Symbol.for("ValidatePayment")
}

enum ActionTypes {
    CaptureCard = "CaptureCard",
    StepUp = "StepUp",
    UpdateCard = "UpdateCard",
    ValidateCard = "ValidateCard",
    ValidatePayment = "ValidatePayment"
}

declare module songbird {}

export  { ActionTypes, ActionTypeSymbols };