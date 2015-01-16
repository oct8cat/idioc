'use strict';

var _paths = {},
    _modules = {}

function ioc(id) {
    if (_modules[id]) { return _modules[id] }
    if (id.charAt(0) === '$') { return require(id.substr(1)) }

    var path = _paths[id]
    if (!path) { throw new TypeError('Module not registered: ' + id) }

    var m = require(_paths[id])

    _modules[id] = typeof m === 'function' ? ioc.inject(m) : m
    return _modules[id]
}

ioc.inject = function(fn) {
    var ids = fn.toString().match(/function\s*\((.*)\)/)[1],
        deps = ids ? ids.split(',').map(function(d) { return ioc(d.trim()) }) : []

    return fn.apply(fn, deps)
}

ioc.register = function(paths) {
    Object.keys(paths).forEach(function(path) {
        _paths[path] = paths[path]
    })
    return ioc
}

module.exports = ioc
