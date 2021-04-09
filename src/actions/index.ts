const ActionTypes = {
    CaptureCard: Symbol.for("CaptureCard"),
    StepUp: Symbol.for("StepUp"),
    UpdateCard: Symbol.for("UpdateCard"),
    ValidateCard: Symbol.for("ValidateCard"),
    ValidatePayment: Symbol.for("ValidatePayment")
}

declare module songbird {}

export  { ActionTypes };