'use strict';

var PORT = process.env.PORT || 3000

require('./ioc').inject(function(app) {
    app().listen(PORT, function() {
        console.log('Now running on ' + PORT)
    })
})
