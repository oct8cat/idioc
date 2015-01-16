# idioc - Inversion of control for idiots (by idiots).

## Usage

### Example

#### Directory structure
```
ioc.js
index.js
lib/
  |
  +- store.js
  +- service.js
```

#### ioc.js
```javascript
/**
 * Container configuration.
 * Registers local modules `service` and `store`.
 */
var ioc = module.exports = require('ioc'),
    j = require('path').join,
    env = process.env.NODE_ENV || 'development'

ioc.register({
    service: j(__dirname, 'lib/service'),

    // Mocking for test, yay!
    store: j(__dirname, env === 'test' ? 'mocks/store' : 'lib/store')
})
```

#### lib/store.js
```javascript
/**
 * Exports our store module.
 * Note that you can inject core/vendor module by prefixing its id with `$`.
 * @param {object} $mongoose Mongoose injection.
 */
module.exports = function($mongoose) {
    return {
        // Retrieves something by ID using mongoose.findById()
        getSomething: function(what, cb) {
            $mongoose.model(what).findById(id, cb)
        }
    }
}
```

#### lib/service.js
```js
/**
 * Exports out service module.
 * @param {object} store Store injection.
 */
module.exports = function(store) {
    return {
        // Retrieves user by ID using store.getSomething()
        getUser: function(id, cb) {
            store.getSomething('User', id, cb)
        }
    }
}
```

#### index.js
```js
var ioc = require('./ioc'),
    service = ioc('service')

service.getUser(1, function(err, user) {
    // service.getUser -> store.getSomething -> mongoose.findById
})
```

### Anonymous modules

Use `ioc.inject()` to inject dependencies into anonymous module.

```js
var ioc = require('./ioc')

ioc.inject(function(service, store) {
    // Here's your shit, all injected.
})
```

## Tests

```
$ npm test
```
