# Switchover SDK for NodeJS

![npm](https://img.shields.io/npm/v/switchover-node-sdk)
![CI](https://github.com/switchover-io/js-sdk/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/switchover-io/node-sdk/branch/main/graph/badge.svg)](https://codecov.io/gh/switchover-io/node-sdk)
[![CodeFactor](https://www.codefactor.io/repository/github/switchover-io/node-sdk/badge/main)](https://www.codefactor.io/repository/github/switchover-io/node-sdk/overview/main)


## Switchover

Switchover is a Software-As-A-Service for managing feature toggles (aka switches, flags or feature flips) in your application. Use it for Continous Integration, Continous Delivery, A/B-Testing, Canary Releases, Experementing and everything else you can think of.

__Note:__
Use this SDK for node javascript projects.

## Getting Started


### Install

Install via npm:
```bash
npm i switchover-node-sdk
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

    onUpdate: ( keys ) => {
        /* updated will be called if some toggle keys are changed */
    }
});

/* Now you can do a initial fetch. It would be also possible to wait for the first update cycle */
client.fetch( () => {
    //...
});
```

## What is the `Context`?

The context holds any data (key-value pair) which should be evaluated against the toggle conditions. 
This can be anything, from user-related data (email, userId) to pure technical infos (stage, system infos, versions, etc). If you have rollout options you have to provide a uuid (more details below).

> :eyes: **PLEASE NOTE** 
> We do **not** send any context data (and such any user data) to our servers. All evaluations happens on the client. 

In an user webfrontend you would typically want to use userdata like email or userId, etc. to evaluate you feature flag. Of course the toggle conditions should also contain the relevant context key. 

Example: 
```javascript

const ctx = {
    email: "brandon.taylor@bigcorp.org"
}

await client.fetchAsync(); //promised version of fetch()

//feature will be true if email condition is fullfilled
const isFeatureEnabled = client.toggleValue('my-big-feature', false, ctx);

```

If you have specified a rollout option for you feature flag it is important to provide a UUID. You can freely choose, but it should be unique. 

Example:
```javascript
/* Feature flag has rollout options so we must provide a uuid.
   Here we use the email */
const ctx = {
    uuid: "brandon.taylor@bigcorp.org"
}
```
> :warning: **IMPORTANT:** 
> Rollout options expects a uuid. Toggle evaluation will fail and return the default value if you don't provide the uuid.

## Client Options

It's possible to pass numerous options to the client:

|Option|Value|Description|
|:-----|:----|:----|
| `ttl` | `number` |Sets time in seconds before the internal cache becomes stale. By calling `fetch` after the cache is expired will force the client to fetch feature flags from server. Default is null/0, which will keep the cache forever until it will overwritten by manually (force) refresh. This option will be ignored when `autoRefresh` is enabled |
| `autoRefresh` | `boolean`  | On `true` the client will automatically poll for new toggle configurations. The polling interval can be set with `refreshInterval`
| `refreshInterval` | `number` | Sets refresh interval in seconds when `autoRefresh: true`. Default is 60 seconds|
| `onUpdate` | `callback` | Accepts a callback function which will be called on every refresh interval |
| `cache` | `ResponseCache` | You can overwrite the default cache instance by you own cache implementation (e.g. for using redis). The instance must be from type `ResponseCache`. |

## Documentation

Learn more on the official documentation: <a href="https://support.switch-over.io/docs/quick-primer">Switchover Quickstart</a>







