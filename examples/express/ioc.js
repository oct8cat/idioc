'use strict';

var j = require('path').join

module.exports = require('../..').register({
    app: j(__dirname, 'lib', 'app'),
    mainRouter: j(__dirname, 'lib', 'routers', 'main'),
    helloRouter: j(__dirname, 'lib', 'routers', 'hello'),
})
