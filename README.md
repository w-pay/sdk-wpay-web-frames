# Installation

To install the dev kit, ensure you have npm installed and run

`npm install woolies-dev-kit --save`



> Developer note: The above is the target experience.  Until the package is deployed to an npm repo, please use `npm link` to link the `woolies-dev-kit` module to your project.
> 
> In the woolies-elements project run
> ```
> npm link
> ```
> In your project run
> ```
> npm link woolies-dev-kit
> ```
> You should now be able to use the sdk.

# Getting Started

- Add the sdk to the page

   `<script src="./node_modules/woolies-dev-kit/dist/index.js" />`


- Add a script tag to the page, initialise the SDK and log into the payment platform.

   ``` 
   <script>
      const wooliesApiUri = "https://some_domain/api/v2"
      const WDK = new WooliesDevKit(wooliesApiUri);
      WDK.login('username', 'password');
   </script>
   ```

- Start a new card capture session.

    ```
    WDK.paymentInstrumentService.initCardCapture();
    ```
    This will initialise a new unique card capture session. This call will need to be repeated between subsequent card captures.


- Add the credit card capture element to the page.

    The SDK attaches new elements to `div` placeholders within your page using the element `id`.

    Add an element to your page.

    ```
    <div id="cardElement"></div>
    ```

    After adding your placeholder you can now create your action.  The action will handle all interactions with your elements, including their creation, validation and submission.  When creating an elementm pass in the type of the element you would like to create and the id of the dom element that you would like to attach it to.

    ```
    var action = WDK.createAction(WDK.Actions.CaptureCardDetail);
    action.createElement('card-group', 'cardElement');
    ```

    Loading the page should now display the credit card capture element, displaying card, expiry date and CVV.

- Submitting the page

    Once the user has entered their credit card details, you are going to want to save the details.  To do this, add a Submit button to the page, calling the `submit` function on the action. This will run the card validation, submitting the form if succcessful.

    ```
    <button onClick="function() { action.submit()}">Submit</button>
    ```

    If you would like to clear the element(s), you can also call the `clear` function on the action.

    ```
    <button onClick="function() { action.clear()}">Clear</button>
    ```

# Advanced

## Multiple elements

## Styling & Options

In order to ensure seamless integration with your user experience, styling can either be applied to the container via CSS, or in the case you want to make styling changes inside the frame, be injected into the elements at run time via the options config.

An element has several classes that can be used as targets for styling:
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


## Legacy iFrame

If you would like to use the existing iFrame implementation, initialise the api using the legacy strategy.

```
var wooliesApiUri = "https://some_domain/api/v2"
var WDK = new WooliesDevKit(wooliesApiUri);
WDK.login('username', 'password');
```

## Logging

If you would like to see what is going on inside of the SDK, you can enable logging using the SDK constructor.  Simply set the log level you would like to see and you should be able to see the log output in the console window.  The log level is universal so applies to both the SDK and IFrame content.

### Log Levels

- NONE = 0,
- ERROR = 50,
- INFO = 100,
- DEBUG = 200

