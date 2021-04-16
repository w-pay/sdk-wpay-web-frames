const ServiceTypes = {
    ElementsService: Symbol.for("ElementsService"),
    ThreeDSService: Symbol.for("ThreeDSService"),
    PaymentInstrumentService: Symbol.for("PaymentInstrumentService"),
    PaymentRequestService: Symbol.for("PaymentRequestService"),
    LoggingService: Symbol.for("LoggingService"),
    HttpService: Symbol.for("HttpService"),
    PaymentService: Symbol.for("PaymentService")
};

export {ServiceTypes};