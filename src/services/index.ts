const ServiceTypes = {
    FramesService: Symbol.for("FramesService"),
    ThreeDSService: Symbol.for("ThreeDSService"),
    PaymentInstrumentService: Symbol.for("PaymentInstrumentService"),
    PaymentRequestService: Symbol.for("PaymentRequestService"),
    LoggingService: Symbol.for("LoggingService"),
    HttpService: Symbol.for("HttpService"),
    PaymentService: Symbol.for("PaymentService")
};

export {ServiceTypes};