'use strict';

// Use process' paths to eliminate paths issues when symlinked.
module.paths = process.mainModule.paths


// Utils.
var _ = {},
    toStr = Object.prototype.toString

_.isUndef = function(obj) {
    return typeof obj === 'undefined'
}
_.isFun = function(obj) {
    return toStr.call(obj) === '[object Function]'
}
_.isArr = function(obj) {
    return toStr.call(obj) === '[object Array]'
}
_.isStr = function(obj) {
    return toStr.call(obj) === '[object String]'
}
_.isInj = function(obj) {
    return _.isFun(obj) || (_.isArr(obj) && _.isFun(_.last(obj)))
}
_.isVendorInj = function(obj) {
    return _.isStr(obj) && obj.charAt(0) === '$'
}
_.last = function(arr) {
    return arr[arr.length - 1]
}
_.keys = function(obj) {
    return Object.keys.call(Object, obj)
}
_.trim = function(obj) {
    return String.prototype.trim.call(obj)
}


// Errors factories.
var mkNotRegisteredErr = function(id) {
        return new TypeError('Module not registered: ' + id)
    },
    mkInvalidInjErr = function(inj) {
        return new TypeError('Invalid injection form: ' + typeof inj)
    }


// Private paths and modules storages.
var _paths = {},
    _modules = {}


/**
 * Retrieves named (registered) module instance with all its dependencies injected.
 * @param {string} id Module id.
 */
function ioc(id) {
    // TODO: Non-singletone shit.
    if (!_.isUndef(_modules[id])) { return _modules[id] }
    if (_.isVendorInj(id)) { return require(id.substr(1)) }
    if (_.isUndef(_paths[id])) { throw mkNotRegisteredErr(id) }

    var m = require(_paths[id])
    _modules[id] = _.isInj(m) ? ioc.inject(m) : m

    return _modules[id]
}

/**
 * Injects dependencies into the given anonymous module.
 * @param {Array|function} inj Angular-like injection description.
 */
ioc.inject = function(inj) {
    var fn, deps
    if (_.isFun(inj)) {
        fn = inj
        var ids = fn.toString().match(/function\s*\((.*)\)/)[1] || ''
        deps = ids ? ids.split(',').map(_.trim) : []
    } else if (_.isArr(inj)) {
        fn = inj.pop()
        deps = inj
    } else {
        throw mkInvalidInjErr(inj)
    }
    return fn.apply(fn, deps.map(ioc))
}

/**
 * Registers modules paths.
 * @param {object} paths Paths configuration.
 */
ioc.register = function(paths) {
    // TODO: Rewrite check.
    _.keys(paths).forEach(function(path) {
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
    if (ids === '*') { ids = _.keys(_paths) }
    if (_.isStr(ids)) { ids = ids.split(',').map(function(id) { return id.trim() })}

    ids.forEach(function(id) {
        if (!_.isUndef(_paths[id])) { delete _paths[id] }
        if (!_.isUndef(_modules[id])) { delete _modules[id] }
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
