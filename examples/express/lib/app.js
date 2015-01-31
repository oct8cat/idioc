'use strict';

module.exports = function($express, mainRouter, helloRouter) {
    return function() {
        var app = $express()

        app.use('/hello', helloRouter)
        app.use('/', mainRouter)

        return app
    }
}
