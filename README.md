[![wercker status](https://app.wercker.com/status/375f5818b1b51a0d159de3e17adf8d39/m "wercker status")](https://app.wercker.com/project/bykey/375f5818b1b51a0d159de3e17adf8d39)

# idioc
Angular-like dependency injection helper for Node.js.

## Usage

First of all, register your modules in the container. It is recommended to move the
configuration to a separate module.

```js
// myioc.js
module.exports = require('idioc').register({
    myService: 'path/to/my/service',
    myStorage: 'path/to/my/storage',
})
```

Let's say we have a service `myService` which is depends of storage `myStorage`
and is able to retrieve some data using the storage's API:

```js
// myservice.js
module.exports = function(myStorage) {
    return {
        getSomeData: function(params, cb) {
            myStorage.getSomeDataFromSomewhere(params, cb)
            return this
        }
    }
}
```

Note that we don't need to directly `require` our storage module - it will be injected
into the service automatically. It is also means that you can easily mock the service
when running tests, e.g. using `NODE_ENV` switch in container configuration:

```js
// myioc.js
var env = process.env.NODE_ENV || 'development'

module.exports = require('idioc').register({
    myService: 'path/to/my/service',
    myStorage: env === 'test' ? 'path/to/mock/storage' : 'path/to/my/storage',
})
```

Okay, now we need to implement the storage. Let's say it uses [Mongoose](http://mongoosejs.com)
to retrieve data from MongoDB database. How do we inject core/vendor modules
(those from `./node_modules` or `/usr/lib/node_modules` or whatewer)? Just prefix
dependency name with `$` symbol and it will be threated as a vendor module:

```js
// mystorage.js
module.exports = function($mongoose, $underscore) {
    return {
        getSomeDataFromSomewhere: function(params, cb) {
            $mongoose.model('SomeData').find(params, function(err, data) {
                if (err) { cb(err); return }
                // Make underscore to do something.
                // (It is for the sake of example, don't try that at home.)
                var transformedData = $underscore.pluck(data, ['firstname'])
                cb(null, transformedData)
            })
            return this
        }
    }
}
```

Kinda OK, but we're forced to use these ugly names like `$mongoose` and `$underscore`.
Where's my short and cool `_.pluck()`? No problem, use the long form of injection:

```js
// mystorage.js
module.exports = ['$mongoose', '$underscore', function(mongoose, _) {
    return {
        getSomeDataFromSomewhere: function(params, cb) {
            mongoose.model('SomeData').find(params, function(err, data) {
                // . . .
                var transformedData = _.pluck(data, ['firstname']) // Yay!
                cb(null, transformedData)
            })
            return this
        }
    }
}]
```

Finally, the application module itself, which uses `myService` to do stuff:
```js
// myapp.js
var myioc = require('./myioc'), // Config first.
    myService = myioc('myService')

// That's all - myService is here with all its deps injected.
myService.getSomeData({...params...}, function(err, data) {
    // Take your data (or error - shit happens).
})
```

Or inject the service into anonymous module, it is fine too:
```js
// myapp.js
var myioc = require('./myioc')

myioc.inject(function(myService) { // Long form is available here too.
    myService.getSomeData({...params...}, function(err, data) {
        // . . .
    })
})
```

## API docs
// TODO: document `register()`, `unregister()`, `unregisterAll()`, `inject()`.

## Tests
```
$ npm test
```
