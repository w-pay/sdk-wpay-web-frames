# Installation

```shell
# if you don't have the registry for our scope
echo "@w-pay:registry=https://npm.pkg.github.com" >> .npmrc
# verify details
npm config list

# And! Our SDK
npm install @w-pay/sdk-wpay-web-frames
```

If you receive an error similar to `authentication token not provided`, you will need to load up a GitHub Personal Access Token for your login. The steps are as follows:

1. Visit your [GitHub Token Settings]()
2. Generate a new token for `read:packages`
3. On your terminal, use the command
   ```shell
   npm login --scope=@w-pay --registry=https://npm.pkg.github.com
   ```
4. And enter in your GitHub username and the password would be the token generated on step 2.

> ***Note:*** For backwards compatibility, NPM packages would continue to
> be published to the [NPM Repository](https://www.npmjs.com/package/@wpay/frames). 
> However, the dual-publishing is due to be sunset.


# Getting Started

With the use of this SDK, the PCI obligations of the merchant application is minimized. Flexibility
pertaining to styling of the card capturing elements for brand management is possible.

This getting started guide is a rapid introduction on using this SDK.

## (Step 1) Marking Rendering Elements

The SDK would inject the appropriate `<iframe/>` and other markers by pre-configured by the merchant.
For a very quick introduction, presume your page would be decorated with the following `<div/>` elements.

> Note - the naming convention of the node ID's is not relevant. These names are passed in later, and as
> long as the identifiers are addressable by `document.getElementById`, it is suitable.

```html
<div id="default-card-capture-group">
  <!-- provide an interface which would accept the card number, expiry, and cvv -->
</div>

<div id="single-card-number">
  <!-- only the card number would be injected -->
</div>
<div id="single-card-expiry">
  <!-- only the card expiry field would be injected -->
</div>
<div id="single-card-cvv">
  <!-- likewise, only the CVV capture field would be rendered -->
</div>

<button id="cha-ching">Pay the Man</button>
```

## (Step 2) Initialize the Client-Side SDK

Add the SDK to the page -- the method would vary greatly depending on your client-side framework
being employed -- such as Angular, ReactJS, Vue.js, and so on. For the purposes of this quick starter,
we would assume a vanilla HTML page is being rendered.

```html

<script src="./node_modules/@w-pay/sdk-wpay-web-frames/dist/framesSDK.js"></script>

<script type="application/javascript">

  async function bootUpFramesSdk() {

    const sdk = new FRAMES.FramesSDK({
                                       apiKey: '<your_api_key>',
                                       authToken: 'Bearer <session_created_associated_for_wallet>',
                                       apiBase: "https://pt-api.wpay.com.au/wow/v1/pay/instore",
                                       logLevel: FRAMES.LogLevel.DEBUG //optional
                                     });

    const captureAction = sdk.createAction(FRAMES.ActionTypes.CaptureCard);
    
    // this is important for the SDK to obtain additional metadata from the backend
    // it is an async task -- so either await or treat it with the Promise.then...
    await captureAction.start();
    
    // the various options and configurations will be expanded on later!
    const options = {};
    
    if (merchant_wants_to_control_each_input_field) {
      captureAction.createFramesControl('CardNo', 'single-card-number', options);
      captureAction.createFramesControl('CardExpiry', 'single-card-expiry', options);
      captureAction.createFramesControl('CardCVV', 'single-card-cvv', options);
    } else {
      captureAction.createFramesControl('CardGroup', 'default-card-capture-group', options);
    }
    
    /*
    ///////// NOTE: ADDITIONAL CODE SAMPLES WILL BE PLACED HERE ///////////
     */
  }


  // only for illustration purposes that the page is starting up
  // it would vary from framework, to framework
  window.onload = bootUpFramesSdk;
  
</script>
```


## (Optional Step 3) Customizing the Elements

Several styling options and configuration can be used to customize the input fields. The options
which may be applied for customizing the layout are:

```javascript
const options = {
  "allowAutoComplete": true, // by default, this is false
  "css": "", // a CSS style as if it would appear in <style type="text/css"></style> -- see advanced section later
  
  "style": { // the ROOT level style applied to all elements
      // key-values to appear similar to <div style="key: value"/>
  },

  // things which would target the card group "container" (not the fields)
  "cardGroup": {
    "style": { // key-value pairs for style on <img style="key: value; ..."/>
    }
  },
  
  // controls card number field (even if card group is used)
  "cardNo": {
    "cardType": {
      "layout": "right", // by default to the right
      "style": { // key-value pairs for style on <img style="key: value; ..."/>
      }
    },
    "style": {
      "fontWeight": "bold",
      "fontStyle": "normal"
    }
  },

  "cardExpiry": {
    "style": { // key-value pairs for style on <img style="key: value; ..."/>
    }
  },

  "cardCVV": {
    "style": { // key-value pairs for style on <img style="key: value; ..."/>
    }
  },
};
```


A simplified and contrived example follow for illustration:

```javascript
const options = {
  "css" : `
        input::placeholder {
            color: blue;
        }

        input:hover::placeholder {
            color: green;
        }
    `,
  "style": {
    "height": "40px",
    "fontSize": "30px",
    "fontStyle": "italic"
  },

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
}
```

## (Step 4) Capturing the Card

The last step is to capture the card, and handle any issues. Extending the JavaScript from step 2:

```javascript
const captureAction = from_where_we_left_off;

document.getElementById('cha-ching').onclick = async function () {
  // we will ask all the frame elements to send their data
  // internally, this would call the client side captureAction.validate()
  try {
    await captureAction.submit();
  } catch {
    // if there was a problem, most likely a validation issue
    // you can grab all the errors as an object and transform it for
    // user display -- by for developer getting started
    console.error({errors: action.errors()});
  }

  const captureResult = await captureAction.complete();

  // or you could redirect the customer!
  console.log(captureResult);
  // and let's clear the data for another card capture
  await action.clear();
};

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

## Error Handling

TODO: Describe `OnValidated`

Here is an example of subscribing to the `OnValidated` event and registering a function to handle the event (updateErrors).  


### Form valid event

If there are multiple elements on a page, there needs to be coordination to know if the form 
as a whole is valid or not. The `FormValid` and `FormInvalid` events can be used instead of
the application having to track the validation status of each element. For example,

```
document.getElementById('cardElement').addEventListener(FRAMES.FramesEventType.FormValid, () => { // Do something });
document.getElementById('cardElement').addEventListener(FRAMES.FramesEventType.FormInvalid, () => { // Do something });
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

## Inject Card Details from External Sources

The merchant's app or checkout page may wish to inject card details into the card capture session. The typical use case would be for a mobile app to have implemented OCR capabilities which would allow their customer to capture the card details using the mobile camera.

To enable this workflow, the method `injectCardDetailsFromPciScopedRuntime` may be called, and as hinted by the method name, would increase the PCI-DSS obligations the merchant's implementation.

Only employ this method if the increased obligation scope has been fully understood by the implementor.

```javascript
// annotated example

// create and start the SDK as per usual
let action = sdk.createAction(FRAMES.ActionTypes.CaptureCard);
await action.start();

// inject the display elements
action.createFramesControl('CardGroup', 'cardElement');

// and to inject the data into the frames
await action.injectCardDetailsFromPciScopedRuntime(
    {
      cardNo: '5353123412341234',
      expiry: '04/20',
      cvv: '999'
    });
```

## Styling & Options

> TODO: describe some styling options within the `<iframe/>`

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
