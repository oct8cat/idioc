'use strict';

/* global describe, beforeEach, it */

var assert = require('assert'),
    ioc = require('../index'),
    j = require('path').join

var pathsLen = function() { return Object.keys(ioc.getPaths()).length },
    cfg = {
        libA: j(__dirname, 'assets/lib/a'),
        libB: j(__dirname, 'assets/lib/b'),
        libC: j(__dirname, 'assets/lib/c'), // This one isn't exists
    },
    cfgLen = Object.keys(cfg).length

var notRegisteredRE = /module not registered/i,
    notFoundRE = /cannot find module/i,
    invalidInjRE = /invalid injection/i

describe('ioc', function() {
    describe('.register()', function() {
        beforeEach(function() { ioc.unregisterAll() })
        it('should register specified modules', function() {
            assert.equal(pathsLen(), 0)
            ioc.register(cfg)
            assert.equal(pathsLen(), cfgLen)
        })
    })
    describe('.unregister()', function() {
        beforeEach(function() { ioc.unregisterAll().register(cfg) })
        it('should unregister specified modules', function() {
            assert.equal(pathsLen(), cfgLen)
            ioc.unregister('libB')
            assert.equal(pathsLen(), cfgLen - 1)
            assert.throws(function() { ioc('libB') }, notRegisteredRE)
            assert.doesNotThrow(function() { ioc('libA') })
        })
    })
    describe('.unregisterAll()', function() {
        beforeEach(function() { ioc.unregisterAll().register(cfg) })
        it('should unregister all modules', function() {
            assert.equal(pathsLen(), cfgLen)
            ioc.unregisterAll()
            assert.equal(pathsLen(), 0)
        })
    })
    describe('.inject()', function() {
        beforeEach(function() { ioc.unregisterAll().register(cfg) })
        it('should deal with short injection form', function() {
            ioc.inject(function(libA, libB) {
                assert(libA)
                assert(libB)
                assert.equal(libA, libB.libA)
            })
        })
        it('should deal with long injection form', function() {
            ioc.inject(['libA', 'libB', function(a, b) {
                assert(a)
                assert(b)
                assert.equal(a, b.libA)
            }])
        })
        it('should notify about invalid injection form.', function() {
            assert.throws(function() { ioc.inject(null) }, invalidInjRE)
        })
        it('should fail on nonexist dependencies', function() {
            assert.throws(function() { ioc.inject(function(libC) {  }) }, notFoundRE)
        })
    })

    beforeEach(function() { ioc.unregisterAll().register(cfg) })
    it('should deal with named modules', function() {
        var libA = ioc('libA'),
            libB = ioc('libB')
        assert(libA)
        assert(libB)
        assert.equal(libA, libB.libA)
    })
    it('should fail on nonexist modules', function() {
        assert.throws(function() {
            ioc.inject(function(libC) {  })
        }, notFoundRE)
    })
})
