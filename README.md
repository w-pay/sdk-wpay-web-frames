# Installation

To install the dev kit, ensure you have npm installed and run

`npm install @wpay/frames --save`

> Developer note: The above is the target experience.  Until the package is deployed to an npm repo, please use `npm link` to link the `@wpay/frames` module to your project.
> 
> In the @wpay/frames project run
> ```
> npm link
> ```
> In your project run
> ```
> npm link @wpay/frames
> ```
> You should now be able to use the sdk.

# Getting Started

## Example One - Card Capture

- Add the sdk to the page

   `<script src="./node_modules/@wpay/frames-sdk/dist/framesSDK.js"></script>`


- Add a script tag to the page, initialise the SDK and log into the payment platform.

   ``` 
   <script>
        const sdk = new FRAMES.FramesSDK({
            apiKey: 'YOUR_API_KEY', 
            authToken: 'YOUR_AUTH_TOKEN' // Format: Bearer token_value, 
            apiBase: "https://dev.mobile-api.woolworths.com.au/wow/v1/pay/instore", 
            logLevel: FRAMES.LogLevel.DEBUG
        });
   </script>
   ```

- Start a new card capture action. The action will handle all interactions with your elements, including their creation, validation and submission.

    ```
    let action = sdk.createAction(FRAMES.ActionTypes.CaptureCard);
    action.start();
    ```
    This will initialise a new card capture action. This call will need to be repeated between subsequent card captures.


- Add the credit card capture frames to the page.

    The SDK attaches new elements to `div` placeholders within your page using the element `id`.

    Add an element to your page.

    ```
    <div id="cardElement"></div>
    ```

    After adding your placeholder you can now create your frames element.  When creating an element pass in the type of the element you would like to create and the id of the dom element that you would like to attach it to.

    ```
    action.createFramesControl('CardGroup', 'cardElement');
    ```

    Loading the page should now display the credit card capture element, displaying card, expiry date and CVV.

- Submitting the page

    Once the user has entered their credit card details, you are going to want to save the details.  To do this, add a Submit button to the page, calling the `submit` function on the action. This will run the card validation, submitting the form if succcessful.

    ```
    <button onClick="async function() { await action.submit()}">Submit</button>
    ```

    Once successfully submitted an action needs to be completed.  Do so by calling complete.

    ```
    let captureResult = await action.complete();

    // The save option can be overwritten at completion time. This allows the customer
    // to give input into whether a card should be saved or not post form rendering.
    let captureResult = await action.complete(false);
    ```

    If you would like to clear the element(s), you can also call the `clear` function on the action.

    ```
    <button onClick="async function() { await action.clear()}">Clear</button>
    ```

## Example Two - Step Up token creation

- Add the sdk to the page

   `<script src="./node_modules/@wpay/frames/dist/framesSDK.js" />`


- Add a script tag to the page, initialise the SDK and log into the payment platform.

   ``` 
   <script>
        const sdk = new FRAMES.FramesSDK({
            apiKey: 'YOUR_API_KEY', 
            authToken: 'YOUR_AUTH_TOKEN' // Format: Bearer token_value, 
            apiBase: "https://dev.mobile-api.woolworths.com.au/wow/v1/pay/instore", 
            logLevel: FRAMES.LogLevel.DEBUG
        });
   </script>
   ```

- Start a new card step up action referencing your paymentInstrumentID and the scheme of the instrument (e.g. VISA)

    ```
    let action = sdk.createAction(
        FRAMES.ActionTypes.StepUp,
        {
            paymentInstrumentId: <YOUR PAYMENT INSTRUMENT ID>,
            scheme: <PAYMENT INSTRUMENT SCHEME>
        }
    );
    action.start();
    ```
    This will initialise a new step up action. This call will need to be repeated between subsequent step up token requests.


- Add the cvv element to the page.

    The SDK attaches new elements to `div` placeholders within your page using the element `id`.

    Add an element to your page.

    ```
    <div id="cvvElement"></div>
    ```

    After adding your placeholder you can now create your frames element.  When creating an element pass in the type of the element you would like to create and the id of the dom element that you would like to attach it to.

    ```
    action.createFramesControl('CardCVV', 'cvvElement');
    ```

    Loading the page should now display the credit card capture element, displaying card, expiry date and CVV.

- Submitting the page

    Once the user has entered their CVV, you are going to want to submit and create the step up token.  To do this, add a Submit button to the page, calling the `submit` function on the action.

    ```
    <button onClick="async function() { await action.submit()}">Submit</button>
    ```

    Once successfully submitted an action needs to be completed.  Do so by calling complete.

    ```
    let stepUpResult = await action.complete();

    ```

# Advanced

## Multiple elements

The process for using individual elements is much the same as the single grouped element, however split across multiple ekements.

Instead of adding a single, control, use the action to create multiple controls.

```
action.createFramesControl('CardNo', 'cardCaptureCardNo', options);
action.createFramesControl('CardExpiry', 'cardCaptureExpiry', options);
action.createFramesControl('CardCVV', 'cardCaptureCVV', options);
```

Thats all you need to do.  When you submit the action, the SDK will manage the submission of all of the individual elements for you.

## Error Handling

Things don't always go smoothly, so sometimes there will be errors within the frames that you need to be aware of.

Here is an example of subscribing to the OnValidated event and registering a function to handle the event (updateErrors).  Please note: The event needs to be registered on the 
placeholder element that the element is injected into.  Registering in the wrong place may mean you miss the event.

```
document.getElementById('cardCaptureCardNo').addEventListener(FRAMES.FramesEventType.OnValidated, updateErrors);
```

Update errors might look something like this (Pure JS example):

```
async function updateErrors() {
    if (action.errors()) { 
        document.getElementById('cardCaptureErrors').innerHTML = "<ul>"

        for (error of action.errors()) {
            document.getElementById('cardCaptureErrors').innerHTML += `<li>${error}</li>`;
        }

        document.getElementById('cardCaptureErrors').innerHTML += "</ul>"
    } else {
        document.getElementById('cardCaptureErrors').innerHTML = "";
    }
}
```

Here is a basic mapping of the errors that are returned by the validation
```
errorMap: {
    'Card Number Required': 'Please enter a valid card number.',
    `Invalid Card Number`: 'Please enter a valid card number.',
    'Invalid Expiry': 'Please enter a valid expiry.',
    'Incomplete Expiry': 'Please enter a valid expiry',
    'Expired card': 'The expiry entered is in the past. Please enter a valid expiry.',
    'Invalid CVV': 'Please enter a valid CVV.'
}
```

## Events - OnFocus & OnBlur

Sometimes you have an advanced use case like turning on and off buttons once all fields are complete which mean that you need to know when controls are visited.  Typically this type of activity would be done using onFocus or onBlur events.

If you would like to listen into these events you can do so by adding an event listener to 
the placeholder element in much the same way as you do for validation. For example,

```
document
    .getElementById('cardCaptureCardNo')
    .addEventListener(Frames.FramesEventType.OnBlur, () => { // Do something onBlur });
```

## Styling & Options

In order to ensure seamless integration with your user experience, styling can either be applied to the container via CSS, or in the case you want to make styling changes inside the frame, be injected into the Frames at run time via the options config.

An frame has several classes that can be used as targets for styling:
- woolies-element
- container
- error (only applied when the element has been validated and reported an error)

Here is an example of how one might use these classes to customise the style of the elements:

```
.woolies-element.container {
    border: 1px solid #d9d9d9;
    margin-left: 5px;
    padding: 5px;
}

.woolies-element.error {
    border: 1px solid #D0021B;
    background-color: #FFECEE;
}
```

If you would like to further style the internal aspects of the element such as font-family/style/weight you can do so using the options object.

The options object allows you to either apply styling to all elements under the control of an action, or scope your changes to only the elements you want to change.

For instance this would set the height of the frame element top 40px and apply a font size of 30 pixels to all elements:

```
let options = {
    "height": "40px",
    "style": {
        "fontSize": "30px"
    }
}
```

If you then wanted to make the cardNo element bold, while making the other fields italic, you could do so like this:

```
let options = {
    "height": "40px",
    "cardNo": {
        "style": {
            "fontWeight": "bold",
            "fontStyle": "normal"
        }
    },
    "style": {
        "fontSize": "30px",
        "fontStyle": "italic"
    }
}
```

The cardNo element is a little unique in that it has a sub element type that is used to show an image based on card scheme.  This element can also be targeted and has an additional property allowing you to choose which side of the element it is displayed on.

This example moves the card type to the right and sets the image width to 50px to fill out the space:

```
let options = {
    "height": "40px",
    "cardNo": {
        "cardType": {
            "layout": "right",
            "style": {
                "width": "50px"
            }
        },
        "style": {
            "fontWeight": "bold",
            "fontStyle": "normal"
        }
    },
    "style": {
        "fontSize": "30px",
        "fontStyle": "italic"
    }
}
```

Sometimes you want to make customisations that cant be inlined, such as change the placeholder text, or have a different colour on hover.  You are able to do this by injecting CSS styling into the frame using the css property.

This example sets the placeholder colour to blue and changes it to green on hover:

```
let options = {
    height: "40px",
    "cardNo": {
        "cardType": {
            "layout": "right",
            "style": {
                "width": "50px"
            }
        },
        "style": {
            "fontWeight": "bold",
            "fontStyle": "normal"
        }
    },
    "style": {
        "fontStyle": "italic",
        "color": "blue",
        "fontSize": "30px"
    },
    "css" : `
        input::placeholder {
            color: blue;
        }

        input:hover::placeholder {
            color: green;
        }
    `
}
```

## Logging

If you would like to see what is going on inside of the SDK, you can enable logging using the SDK constructor.  Simply set the log level you would like to see and you should be able to see the log output in the console window.  The log level is universal so applies to both the SDK and IFrame content.

### Log Levels

- NONE = 0,
- ERROR = 50,
- INFO = 100,
- DEBUG = 200

## Capture Card Options

### Card verification

By default, the card verification is disabled on card capture.  If you would like to capture a card and enforce verification, provide a `verify: true` property when initialising the capture card action.

e.g.

```
const action = cdk.createAction(FRAMES.ActionTypes.CaptureCard, { verify: true });
```

# 3DS2

> Please note:  In order to use 3DS you merchant must have had 3DS enabled

The Frames SDK offers 3DS2 verification cababilities by wrapping Cardinals (https://www.cardinalcommerce.com/) 3DS songbird library and orchestrating the 3DS verification process.  There are 2 supported flows, one for verification of cards during the capture process and a second for verification at time of payment.

## Selecting an environment

Cardinal is a little unique in how it does environement management, providing 2 instances of the songbird library, one for staging and a second for production use.  Both versions of the library have been included in the SDK so that there are no code changes required between environments.

In order to protect production the SDK will use the staging version by default.  In order to switch the threeDS enabled actions over to production you need to provide the following in your options when creating the action.

```
{
    threeDS: {
        env: "prod"
    }
}
```

Here is an example of the prod config being used to validate a card:

```
const enrollmentRequest: any = {
    sessionId: CARD_CAPTURE_RESPONSE_TOKEN,
    threeDS: {
        env: "prod"
    }
};

const action = this.framesSDK.createAction(FRAMES.ActionTypes.ValidateCard, enrollmentRequest);
```

## Card Verification

If you wish to perform 3DS2 verification as part of a card capture exercise, you can do so by specifying that 3DS is required when initializing the card capture action.

- Create a new card capture action, specifying that 3DS is required.

```
const captureCardAction = this.framesSDK.createAction(
    FRAMES.ActionTypes.ValidateCard,
    {
        threeDS: {
          requires3DS: true
        }
    }
) as CaptureCard;
```

- Capture card as per normal.  When you call complete, you will recieve a failure with a 3DS challenge.  For example:

```
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJPcmdVbml0SWQiOiI2MGFmOGExZTBiYWM1ZDUwY2MyNmYzM2MiLCJSZWZlcmVuY2VJZCI6ImUxYzdjNzk4LWE1MjYtNDZhMC05ODU4LTRmNGIwMmNlNzdiOSIsImlzcyI6InBldGN1bHR1cmUiLCJQYXlsb2FkIjp7ImFjdGlvbklkIjoiYzYxZmM1OTgtZDU3ZS00MWM3LTg4YzQtMjhhODlkOTczYzEyIiwib3JkZXJJbmZvcm1hdGlvbiI6eyJhbW91bnREZXRhaWxzIjp7ImN1cnJlbmN5IjoiQVVEIn19fSwiaWF0IjoxNjI3NTE3MTc2LCJqdGkiOiIzNDMyMDBmMC0wNzQ3LTQ1NWUtODdlMi04ZTU5OTc3ZTAzMDEifQ.bghcu82uOuN6LSX_oKPj8f6WjBMhnXK3DYUkfp1F0mc",
    "message": "3DS TOKEN REQUIRED"}
}
```

- Create and start a validateCard action.  This will initialise the cardinal library and perform device data capture.

```
const enrollmentRequest: any = {
    sessionId: cardCaptureResponse.token,
    threeDS: {
        env: "staging"
    }
};

const action = this.framesSDK.createAction(FRAMES.ActionTypes.ValidateCard, enrollmentRequest);
await action.start();
```

- Set the targetElement that you would like the 3DS frame to render to

```
action.createFramesControl('ValidateCard', 'yourElementId');
```

- Typically the 3DS window is displayed as a modal, however hte IFrame can be embedded anywhere.  To assist in building out your experience, we have 2 events:
  - OnRender: Triggered once the issuer content has been embedded into the targetElement
  - On Close: Triggered once the issuer content has been dismissed.

  These events can be subscribed to in the typical fashion:

  ```
    const renderEventListener = () => {
        // Do something on render
        console.log('Show modal');
    };

    const closeEventListener = () => {
        // Do something on close
        console.log('Hide modal');
    };

    elementHandle.addEventListener(FRAMES.FramesCardinalEventType.OnRender, renderEventListener);
    elementHandle.addEventListener(FRAMES.FramesCardinalEventType.OnClose, closeEventListener);
  ```

- Complete the validateCard action.  If successful this will return a challengeResponse that can be used to complete the captureCard action.

```
const validationResponse = await action.complete();
```

Here is an example reponse:
  ```
{
    "threeDSData": {
        "Validated": true,
        "ActionCode": "SUCCESS",
        "ErrorNumber": 0,
        "ErrorDescription": "Success",
        "Payment": {
            "Type": "CCA",
            "ExtendedData": {
                "Amount": "0",
                "CAVV": "MTIzNDU2Nzg5MDEyMzQ1Njc4OTA=",
                "CurrencyCode": "036",
                "ECIFlag": "05",
                "ThreeDSVersion": "2.1.0",
                "PAResStatus": "Y",
                "SignatureVerification": "Y"
            },
            "ProcessorTransactionId": "Rq6wpFnMVE9tMpRjuIC0"
        }
    },
    "challengeResponse": {
        "type": "3DS",
        "instrumentId": undefined,
        "token": "Rq6wpFnMVE9tMpRjuIC0",
        "reference": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJPcmdVbml0SWQiOiI2MGFmOGExZTBiYWM1ZDUwY2MyNmYzM2MiLCJSZWZlcmVuY2VJZCI6ImE4N2VmMWM3LWE4ZjUtNGYzNy05MjY2LTQzMzE0MzNmNjJiOSIsImlzcyI6InBldGN1bHR1cmUiLCJQYXlsb2FkIjp7ImFjdGlvbklkIjoiODQwOTE1YTQtNjkzYS00YmQ3LTk1OTMtZGZjYWM0YjE4NjQ2Iiwib3JkZXJJbmZvcm1hdGlvbiI6eyJhbW91bnREZXRhaWxzIjp7ImN1cnJlbmN5IjoiQVVEIn19fSwiaWF0IjoxNjI3NTE5MzY1LCJqdGkiOiJkZmM4MWRiOC01YTA1LTQzMTUtODBmMy00NDAyNTZiZjA2MTgifQ.BIcz8Jk6cFYYSv872M1mCISEQqAvWJKDeDXv-2qF-ko"
    }
}
  ```

- Complete the capture card action, providing the challengeResponse.  This should return the standard card capture response with the addition of the 3DS evidence used in its creation.

```
const cardCaptureResponse = await this.captureCardAction.complete(this.saveCard, [validationResponse.challengeResponse]);
```

- As part of good house keeping we should unsubscribe from the events we subscribed to earlier:

```
elementHandle.removeEventListener(FRAMES.FramesCardinalEventType.OnRender, renderEventListener);
elementHandle.removeEventListener(FRAMES.FramesCardinalEventType.OnClose, closeEventListener);
```

## Payment Verification

If 3DS has been requested as part of the payment flow then you will be required to provide a 3DS challenge response when attempting to make a payment.  To create the challenge response, you need to create and execute the validatePayment action.  This will orchestrate 3DS verifaction using the Cardinal Songbird library and return a chellengeResponse that can then be used when making a payment.



- Create a paymentRequest using the WPay SDK passing in the config for 3DS.
>Please note, your schemaId may differ

```
const request = {
    merchantReferenceId: 12345,
    maxUses: 3,
    timeToLivePayment: 300,
    grossAmount: 2.40,
    merchantPayload: {
        schemaId: '0a221353-b26c-4848-9a77-4a8bcbacf228',
        payload: { 
            requires3DS: settings.merchant.require3DSPA 
        }
    }
};

return merchantSDK.payments.createPaymentRequest(request);
```

- Make a payment.  The request should fail requesting a 3DS challenge response, you will need need the session returned when creating the challengeResponse below.

```
const transaction = await customerSDK.paymentRequests.makePayment(paymentRequestId, paymentInstrumentId);
```

Here is an example of rejected transaction with 3DS challenge:

```
{
    "type": "PAYMENT",
    "status": "REJECTED",
    "rollback": "NOT_REQUIRED",
    "merchantId": "petculture",
    "grossAmount": 12.4,
    "instruments": [
        {
            "transactions": [],
            "instrumentType": "CREDIT_CARD",
            "paymentInstrumentId": "198821"
        }
    ],
    "executionTime": "2021-07-29T01:53:33.517Z",
    "transactionId": "9b5eaf73-30d8-4f32-aeb5-e1c4ac2a2a8c",
    "clientReference": "9b5eaf73-30d8-4f32-aeb5-e1c4ac2a2a8c",
    "subTransactions": [
        {
            "threeDS": {
                "sessionId": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNGE5MjVhNi0wNzFmLTRiZjEtODA0MS1lOGJmNjEwYzQ4ZTgiLCJpYXQiOjE2Mjc1MjM2MTcuMDk4LCJpc3MiOiJwZXRjdWx0dXJlIiwiT3JnVW5pdElkIjoiNjBhZjhhMWUwYmFjNWQ1MGNjMjZmMzNjIiwiUGF5bG9hZCI6eyJwYXltZW50SW5zdHJ1bWVudElkIjoiMTk4ODIxIiwib3JkZXJJbmZvcm1hdGlvbiI6eyJhbW91bnREZXRhaWxzIjp7ImN1cnJlbmN5IjoiQVVEIiwiYW1vdW50IjoxMi40fX19LCJPYmplY3RpZnlQYXlsb2FkIjp0cnVlLCJSZWZlcmVuY2VJZCI6IjQ1OTA3MzQ5LWU2OTEtNDFkOS05Njk3LTgxYWFiMTc4MzZlZSJ9.W9D3yDqnGDZg3QncvVmiVfe7d8LW2se4yeS2jx7rPZQ",
                "paymentInstrumentId": "198821"
            },
            "errorCode": "3DS_001",
            "errorMessage": "3DS TOKEN REQUIRED"
        }
    ],
    "paymentRequestId": "34a925a6-071f-4bf1-8041-e8bf610c48e8",
    "merchantReferenceId": "d0a118eb-613e-4899-8b71-70806abd40be"
}
```

- Create and start the validatePayment action.  This will initialise the cardinal library and perform device data capture.

```
const enrollmentRequest: any = {
    sessionId, (Provided in the 3DS challenge)
    paymentInstrumentId, (The payment instrumentID you want to perform 3DS on - must match instrument used in the challenge)
    threeDS: {
        env: "staging",
        consumerAuthenticationInformation: {
          acsWindowSize: this.acsWindowSize,
        }
    }
};

const action = this.framesSDK.createAction(FRAMES.ActionTypes.ValidatePayment, enrollmentRequest) as ValidatePayment;

await action.start();
```
- Set the targetElement that you would like the 3DS frame to render to

```
action.createFramesControl('ValidatePayment', 'yourElementId');
```

- Typically the 3DS window is displayed as a modal, however hte IFrame can be embedded anywhere.  To assist in building out your experience, we have 2 events:
  - OnRender: Triggered once the issuer content has been embedded into the targetElement
  - On Close: Triggered once the issuer content has been dismissed.

  These events can be subscribed to in the typical fashion:

  ```
    const renderEventListener = () => {
        // Do something on render
        console.log('Show modal');
    };

    const closeEventListener = () => {
        // Do something on close
        console.log('Hide modal');
    };

    elementHandle.addEventListener(FRAMES.FramesCardinalEventType.OnRender, renderEventListener);
    elementHandle.addEventListener(FRAMES.FramesCardinalEventType.OnClose, closeEventListener);
  ```

- Complete the action.  If successful this will return a 3DS challenge response.

```
const validationResponse = await action.complete();
```

- Make the payment providing the challengeResponse in the request.  The payment should now go through successfully.

```
const transaction = await this.customerSDK.paymentRequests.makePayment(paymentRequestId, paymentInstrumentId, [], undefined, undefined, undefined, [validationResponse.challengeResponse]);
```

- As part of good house keeping we should unsubscribe from the events we subscribed to earlier:

```
elementHandle.removeEventListener(FRAMES.FramesCardinalEventType.OnRender, renderEventListener);
elementHandle.removeEventListener(FRAMES.FramesCardinalEventType.OnClose, closeEventListener);
```

### Additional 3DS config

At times you may want to leverage additional config items made available by cybersource, such as flags to force 3DS step up or specify a window size.  These additional config values can be found in the ```consumerAuthenticationInformation``` block.

Here is an example of the configuration you would use when creating a validateCard action to use the ```consumerAuthenticationInformation``` to set the window size:

```
{
    sessionId: "YOUR_SESSION_ID",
    threeDS: {
        consumerAuthenticationInformation: {
            acsWindowSize: "01",
        }
    }
}
```

For a full list of options (and descriptions), check out the cybersource documentation for the "Check Payer Auth Enrollment" endpoint.  The request payload contains the property ```consumerAuthenticationInformation``` which is the property exposed above.

Cybersource docs - https://developer.cybersource.com/api-reference-assets/index.html#payer-authentication_payer-authentication_check-payer-auth-enrollment

## 3DS ERROR Codes

- 3DS_001: 3DS Token Required
- 3DS_002: Invalid session
- 3DS_003: 3DS Validation Failed
- 3DS_004: Unsupported 3DS Version
- 3DS_005: 3DS Service Unavailable
- 3DS_006: 3DS Authentication Failed
- 3DS_007: 3DS Validation Timeout
- 3DS_100: Merchant does not support 3DS
- 3DS_500: 3DS Unknown Error
