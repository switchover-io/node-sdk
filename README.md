# Switchover SDK for NodeJS

![CI](https://github.com/switchover-io/js-sdk/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/switchover-io/js-sdk/branch/main/graph/badge.svg?token=qVOyfv8fmz)](undefined)

## Switchover

Switchover is a Software-As-A-Service for managing feature toggles (aka switches, flags or feature flips) in your application. Use it for Continous Integration, Continous Delivery, A/B-Testing, Canary Releases, Experementing and everything else you can think of.

__Note:__
Use this SDK for node javascript projects.

## Getting Started


### Install

Install via npm:
```bash
npm i switchover-js-sdk
```

Import the SDK:
```javascript
const Switchover = require('switchover');
```

### Initialize client

You will find your SDK Key on the environment page. Copy it and use it to initialize the client:

Basic usage:

```javascript
const client = Switchover.createClient('<SKD_KEY>'); 

/* fetch toggles from server/cache */
client.fetch( () => {

    /* evaluate the toggle value, provide a default value if evalutation fails */
    const value = client.toggleValue('<YOUR_TOGGLE>', false));

    //...
});
```

Of course it's also possible to enable auto-refresh on toggle updates:

```javascript
const client = Switchover.createClient('<SKD_KEY>', {
    /* Set auto refresh to true, for fetching periodically the toggle status */
    autoRefresh: true,

    /* Set refresh interval, for example 60 seconds */
    refreshInterval: 60,

    onUpdated: ( keys ) => {
        /* updated will be called if some toggle keys are changed */
    }
});

/* Now you can do a initial fetch. It would be also possible to wait for the first update cycle */
client.fetch( () => {
    //...
});
```


## Documentation

Learn more on the official documentation: <a href="https://support.switch-over.io/docs/quick-primer">Switchover Quickstart</a>







