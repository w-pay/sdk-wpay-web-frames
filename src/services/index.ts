const ServiceTypes = {
    ElementsService: Symbol.for("ElementsService"),
    PaymentInstrumentService: Symbol.for("PaymentInstrumentService"),
    PaymentRequestService: Symbol.for("PaymentRequestService"),
    LoggingService: Symbol.for("LoggingService"),
    HttpService: Symbol.for("HttpService"),
    PaymentService: Symbol.for("PaymentService")
};

export {ServiceTypes};