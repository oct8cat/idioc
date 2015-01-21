'use strict';

module.paths.unshift(process.mainModule.paths[0])

var _paths = {},
    _modules = {},
    injRE = /function\s*\((.*)\)/

/**
 * Retrieves named (registered) module instance with all its dependencies injected.
 * @param {string} id Module id.
 */
function ioc(id) {
    // TODO: Non-singletone shit.
    if (_modules[id]) { return _modules[id] }
    if (id.charAt(0) === '$') { return require(id.substr(1)) }

    var path = _paths[id]
    if (typeof path === 'undefined') { throw new TypeError('Module not registered: ' + id) }

    var m = require(_paths[id])

    _modules[id] = typeof m === 'function' ? ioc.inject(m) : m
    return _modules[id]
}

/**
 * Injects dependencies into the given anonymous module.
 * @param {Array|function} inj Angular-like injection description.
 */
ioc.inject = function(inj) {
    var fn, deps
    if (typeof inj === 'function') {
        fn = inj
        var ids = fn.toString().match(injRE)[1] || ''
        deps = ids ? ids.split(',').map(function(d) { return d.trim() }) : []
    } else {
        fn = inj.pop()
        deps = inj
    }
    return fn.apply(fn, deps.map(ioc))
}

/**
 * Registers modules paths.
 * @param {object} paths Paths configuration.
 */
ioc.register = function(paths) {
    // TODO: Rewrite check.
    Object.keys(paths).forEach(function(path) {
        _paths[path] = paths[path]
    })
    return ioc
}

/**
 * Unregisters modules and its paths.
 * @param {string|string[]} ids IDs of modules to unregister. To unregister all
 * available modules pass `*` as a first parameter.
 */
ioc.unregister = function(ids) {
    if (ids === '*') { ids = Object.keys(_paths)}
    if (typeof ids === 'string') { ids = ids.split(',').map(function(id) { return id.trim() })}

    ids.forEach(function(id) {
        if (typeof _paths[id] !== 'undefined') { delete _paths[id] }
        if (typeof _modules[id] !== 'undefined') { delete _modules[id] }
    })
    return ioc
}

/**
 * Unregisters all registered modules. It is an alias for ioc.unregister('*').
 */
ioc.unregisterAll = function() {
    return ioc.unregister('*')
}

/**
 * _paths getter.
 */
ioc.getPaths = function() {
    return _paths
}

/**
 * _modules getter.
 */
ioc.getModules = function() {
    return _modules
}

module.exports = ioc
