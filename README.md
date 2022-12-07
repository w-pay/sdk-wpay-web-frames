# Installation

```shell
# if you don't have the registry for our scope
echo "@w-pay:registry=https://npm.pkg.github.com" >> .npmrc
# verify details
npm config list

# And! Our SDK
npm install @w-pay/sdk-wpay-web-frames
```

If you receive an error similar to `authentication token not provided`, you will need to load up a GitHub Personal
Access Token for your login. The steps are as follows:

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

### Stateful Styling Surrounding the `<iframe/>`

The internal state of the frame control is synchronized with an element surrounding the `<iframe/>` by coordinating the
class names. This would allow a simpler method for custom drawing. By example, the DOM tree would appear something like
the following:

```html

<div id="merchant-supplied-frame-like-card-no">
    <!-- this sub-tree is controlled by the Frames SDK -->
    <div class="woolies-element element-container error">
        <iframe .../>
    </div>
</div>
```

The `.error` class would only be attached when the input failed validation for some reason. This functionality then
allows a cheap solution for styling the elements as per the following example:

```css
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

### Customizing Styling within the `<iframe/>`

Several styling options and configuration can be used to customize the input fields within the custom `<iframe/>`. The
options which may be applied for customizing the layout are:

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
    "css": `
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
        console.error({ errors: action.errors() });
    }

    const captureResult = await captureAction.complete();

    // todo: illustrate capture result has an instrument id
    console.log(captureResult);

    // out of scope: make payment with Wpay using the instrument ID
    // often implemented via a Merchant API Service
};
```

---

# 3DS Card Validation / Challenge

The SDK has facilities for supporting the merchant with 3DS. There are two use cases which may require 3DS
authentication/challenges:

* Adding cards to the shopper's wallet (`card capture` use-case)
* Performing payments (`make payment` use-case)

Similar to other card capture elements, the merchant will need to designate a target element to host the modal elements.

> Please refer to
>
the [test cards published on the Developer Hub](https://developerhub.wpay.com.au/digitalpayments/docs/test-card-numbers#3ds-test-cards)
> to simulate the variations of 3DS decisions.

In general, the workflow would follow the key steps:

1. Perform the step (either `make payment` or `card capture`), to which the action is denied and a "session id" is
   issued
2. Using the "session id," obtain the appropriate "challenge response".
3. Re-attempt the same action as per step 1 but with the additional challenge response obtained from step 3.
4. Profit!

## (Step 1) 3DS Required on Payment or Card Capture

Perform the operation as normal -- if 3DS flow is required to obtain a token, the error response type would
indicate `3DS_001` stating "3DS token required".

> Note: triggering the 3DS token being required is nuanced with many potential triggers, and is beyond the scope of this
> document to exhaustively list the triggers according to your merchant configuration. Please contact your account
> manager
> for technical support to match your business requirements and use-cases.

For concise details of each use case in the phase of receiving the `3DS_001`, see the subheadings for `make payment`
and `card capture`.

### (Step 1a) Make Payment requiring 3DS Token

[When a payment request is made to Wpay](https://developerhub.wpay.com.au/digitalpayments/docs/make-payment#make-a-payment)
, and a 3DS token is required to be accompanied, the transaction would fail. The following condensed snippet is a sample
response.

```json
{
  "type": "PAYMENT",
  "status": "REJECTED",
  "subTransactions": [
    {
      "threeDS": {
        "sessionId": "eyJhbGciOiJI...Vf4yeS2jx7rPZQ",
        "paymentInstrumentId": "12345"
      },
      "errorCode": "3DS_001",
      "errorMessage": "3DS TOKEN REQUIRED"
    }
  ]
}
```

The key elements which the merchant needs to recognize and react to in the above response, is:

1. that the payment failed (`.status == "REJECTED"`);and,
2. the reason it failed is that 3DS token needs to be provided (`.subTransactions[].errorCode == "3DS_001"`).

Since the `make payment` procedure is typically called by the merchant backend, the significant variable to return to
the user interface is the following element, which we will refer into the subsequent steps.

```javascript
// pseudo code -- note the subTransaction may have multiple elements
// depending if split-payments is employed.
const THREEDS_SESSION_ID = initialPaymentRequest.subTransactions[theIndex].threeDS.sessionId;
```

### (Step 1b) Upon Card Capture

As you may recall, card capturing would eventually reach the critical step of `action.complete()`. The following
pseudo-snippet has been illustrated in detecting when a 3DS session needs to commence:

```javascript
async function captureCardToWallet() {
    const shouldSaveCard = true;
    const captureResult = await captureAction.complete(shouldSaveCard);

    if (captureResult.errorCode !== "3DS_001") {
        return captureResult;
    }

    const THREEDS_SESSION_ID = captureResult.token;

    // other code would be appended here (see Step 3b)
}
```

## (Step 2) Card Validation Enrollment and Modal

To begin the card validation, the `THREEDS_SESSION_ID` from Step 0 needs to used to initialize the `ValidateCard`
action. In addition, the frame control for hosting the 3DS modal needs to be nominated.

```javascript
// by way of reminder on the Frames SDK reference
const sdk = new FRAMES.FramesSDK({ /* */ });

// and how to create the 3DS validate action...
async function obtain3dsToken(THREEDS_SESSION_ID) {
    const validateCardRequestParameters = {
        sessionId: THREEDS_SESSION_ID, // NOTE: this is from (Step 0)
        threeDS: {
            // by default, any value other than "prod" is staging
            env: isProduction ? "prod" : "staging",
            consumerAuthenticationInformation: {
                acsWindowSize: "01",        // note: this property is required
                // other options applicable is adjustable as per CyberSource documentation (see below)
            }
        },
    };

    const validateAction = sdk.createAction(
        FRAMES.ActionTypes.ValidateCard,
        validateCardRequestParameters
    );

    // this will load up "Songbird" and other Cardinal 3DS support libs
    await validateAction.start();

    // specify which element to render into - in this case, the following
    // should be accessible `document.getElementById('theTargetElementForValidateCard');
    validateAction.createFramesControl('ValidateCard', 'theTargetElementForValidateCard');

    return await validateAction.complete();
}
```

In the `consumerAuthenticationInformation` property, the full list of options and capabilities are described
on [CyberSouce Documentation for the Enrollment Request](https://developer.cybersource.com/api-reference-assets/index.html#payer-authentication_payer-authentication_check-payer-auth-enrollment)
.

## (Step 3) Retrying to Operation with the 3DS Token

In the prior step (Step 1), the function `obtain3dsToken` would yield a payload which is usable in the re-attempt of the
operation --

```javascript
// callee
const threeDsTokenResult = await obtain3dsToken(THREEDS_SESSION_ID);

// and what needs to be composed into the 3ds token presentation for backend.
const THREEDS_PAYLOAD = threeDsTokenResult.challengeResponse;
// which would eval/yield
//      { /// THREEDS_PAYLOAD
//         "type": "3DS-frictionless", // alternative "3DS"
//         "instrumentId": "12345",
//         "token": "...",
//         "reference": "..."
//      }
```

## (Step 3a) Making Payment with a 3DS Token

The payload `THREEDS_PAYLOAD` is injected into
the [make payment endpoint](https://developerhub.wpay.com.au/digitalpayments/docs/make-payment#make-a-payment) with the
critical transformation being key --

```
// POST /wow/v1/pay/instore/customer/payments

{
  "data": {
    // ...
  },
  "meta": {
    // ...
    "challengeResponses": [
      { /// THREEDS_PAYLOAD
        "type": "3DS-frictionless",
        "instrumentId": "12345",
        "token": "...",
        "reference": "..."
      },
      // ...  other challenges like step ups
    ]
  }
}
```

### (Step 3b) Adding a Card with 3DS Token

Expanding on the pseudo-example from Step 1b, the retry is earmarked below:

```javascript
async function captureCardToWallet() {
    const shouldSaveCard = true;
    const captureResult = await captureAction.complete(shouldSaveCard);

    if (captureResult.errorCode !== "3DS_001") {
        return captureResult;
    }

    const THREEDS_SESSION_ID = captureResult.token;

    // continuation from code sample in Step 1b
    const threeDsTokenResult = await obtain3dsToken(THREEDS_SESSION_ID);
    const THREEDS_PAYLOAD = threeDsTokenResult.challengeResponse;

    // retry with the operation with the token
    return await captureAction.complete(shouldSaveCard, [THREEDS_PAYLOAD]);
}
```

## (Step 4) Detecting and Dealing with Unsuccessful 3DS Authentication

TODO: expand on best practices

## (Optional Step 5) Detecting 3DS Modal Pop-ups

Your user experience may need to detect when the 3DS modal which banks usually challenges the customer via an
interaction. Some user experiences may include displaying a branded loading spinner, dimming the background, and so on.

> Tip: For the challenge modals to be presented in the testing environments, use the "Successful Step-Up Authentication"
>
cards [as published on the Developer Hub](https://developerhub.wpay.com.au/digitalpayments/docs/test-card-numbers#3ds-test-cards)
> .

The following events are emitted when the challenge UI renders and when the challenge is completed and/or dismissed.

```javascript
// your user code.
const handleRenderEventListner = () => {
    /* ... */
};
const handleCloseEventListner = () => {
    /* ... */
};

const domElementHostingValidatedCard = document.getElementById('theTargetElementForValidateCard');

domElementHostingValidatedCard.addEventListener(FRAMES.FramesCardinalEventType.OnRender, renderEventListener);
domElementHostingValidatedCard.addEventListener(FRAMES.FramesCardinalEventType.OnClose, closeEventListener);

// and don't forget to unsubscribe in case you care about memory management...
domElementHostingValidatedCard.removeEventListener(FRAMES.FramesCardinalEventType.OnRender, renderEventListener);
domElementHostingValidatedCard.removeEventListener(FRAMES.FramesCardinalEventType.OnClose, closeEventListener);
```

---

# Advanced Capabilities

## Extended Event Handling

With all the DOM elements nominated for the SDK's actions to attach to, custom events are raised to the DOM element. The
full list of potential events are listed in [framesEventType.ts](src/domain/framesEventType.ts). An example detecting
blur is pseudo-illustrated as per below:

```javascript
// attaching and nominating the DOM elements for the SDK Actions
const captureAction = sdk.createAction(FRAMES.ActionTypes.CaptureCard);
captureAction.createFramesControl('CardNo', 'single-card-number');

// and custom event handling
const handleCardNumberHasFocus = () => {
    console.log('DEMO: in focus');
};
const handleCardNumberWentBlur = () => {
    console.log('DEMO: blurred');
};

const targetElement = document.getElementById('single-card-number');

targetElement.addEventListener(Frames.FramesEventType.OnFocus, handleCardNumberHasFocus);
targetElement.addEventListener(Frames.FramesEventType.OnBlur, handleCardNumberWentBlur);

// and don't forget to manage memory when the event is no longer required
targetElement.removeEventListener(Frames.FramesEventType.OnFocus, handleCardNumberHasFocus);
targetElement.removeEventListener(Frames.FramesEventType.OnBlur, handleCardNumberWentBlur);
```

## Card Verification

When adding a card to the customer's wallet, the tokenization step may validate whether the card details
are correct by performing a verification with the financial institute, to provide early validation.

> Note: validation and fraud detection are different concepts and should not be used interchangeably. Validation
> provides the ability for the user to verify their full card details are correct, thereby uplifting the customer
> experience.

```javascript
// it can be configured as an option when creating the action
const actionOptions = { verify: true };
const captureAction = sdk.createAction(FRAMES.ActionTypes.CaptureCard, actionOptions);

// or alternatively, specified during the `complete` method call.
const shouldVerifyCard = true;
const captureResult = await captureAction.complete(shouldVerifyCard);
```

## Inject Card Details from External Sources

The merchant's app or checkout page may wish to inject card details into the card capture session. The typical use case
would be for a mobile app to have implemented OCR capabilities which would allow their customer to capture the card
details using the mobile camera.

To enable this workflow, the method `injectCardDetailsFromPciScopedRuntime` may be called, and as hinted by the method
name, would increase the PCI-DSS obligations the merchant's implementation.

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

## Example Two - Saved Instrument

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
  This will initialise a new step up action. This call will need to be repeated between subsequent step up token
  requests.


- Add the cvv element to the page.

  The SDK attaches new elements to `div` placeholders within your page using the element `id`.

  Add an element to your page.

    ```
    <div id="cvvElement"></div>
    ```

  After adding your placeholder you can now create your frames element. When creating an element pass in the type of the
  element you would like to create and the id of the dom element that you would like to attach it to.

    ```
    action.createFramesControl('CardCVV', 'cvvElement');
    ```

  Loading the page should now display the credit card capture element, displaying card, expiry date and CVV.

- Submitting the page

  Once the user has entered their CVV, you are going to want to submit and create the step up token. To do this, add a
  Submit button to the page, calling the `submit` function on the action.

    ```
    <button onClick="async function() { await action.submit()}">Submit</button>
    ```

  Once successfully submitted an action needs to be completed. Do so by calling complete.

    ```
    let stepUpResult = await action.complete();

    ```

# Advanced

## Form Validation

## Error Handling

TODO: Describe `OnValidated`

Here is an example of subscribing to the `OnValidated` event and registering a function to handle the event (
updateErrors).


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
