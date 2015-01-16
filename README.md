# idioc - Inversion of control for idiots (by idiots).

## Usage

### Vendor modules

Prefix module id with `$` to inject core Node.js module or a module from `node_modules`

```js
var ioc = require('idioc'),
    assert = require('assert'),
    $assert = ioc('$assert')

// ioc'ed assert is the same as require'd
assert.equal($assert, assert)
```

### Local modules

```js

/* lib/one.js */
module.exports = function() {
    return {}
}

/* lib/two.js - injects libOne */
module.exports = function(libOne) {
    return {libOne: libOne}
}

/* index.js */
var ioc = require('idioc'),
    assert = require('assert'),
    j = require('path').join

ioc.register({
    libOne: j(__dirname, 'lib/one'),
    libTwo: j(__dirname, 'lib/two'),
})

var libTwo = ioc('libTwo')

// libOne is here, injected!
assert(libTwo.libOne)
```

### Anonymous modules

Use `ioc.inject()` to inject dependencies into anonymous module.

```js

var ioc = require('idioc'),
    assert = require('assert')

ioc.register({
    libOne: j(__dirname, 'lib/one'),
    libTwo: j(__dirname, 'lib/two'),
})

ioc.inject(function(libOne, libTwo) {
    // Here's your shit, all injected.
    assert.equal(libOne, libTwo.libOne)
})
```

## Tests

```
$ npm test
```
