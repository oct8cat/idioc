'use strict';

module.exports = function($express) {
    return $express.Router().get('/', function(req, res, next) {
        res.send({response: 'hello'})
    })
}
