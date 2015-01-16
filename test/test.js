'use strict';

/* global describe, before, it */

var assert = require('assert'),
    ioc = require('../index'),
    j = require('path').join

describe('ioc', function() {
    var _libA, _libB

    before(function() {
        ioc.register({
            libA: j(__dirname, 'assets/lib/a'),
            libB: j(__dirname, 'assets/lib/b'),
            libC: j(__dirname, 'assets/lib/c'), // This one is not exists.
        })
        _libA = ioc('libA')
        _libB = ioc('libB')
    })

    it('should deal with vendor modules', function() {
        assert.strictEqual(ioc('$assert'), assert)
    })

    it('should deal with local modules', function() {
        assert.strictEqual(_libB.libA, _libA)
    })

    it('should deal with unregistered modules', function() {
        assert.throws(function() { ioc('unregistered') }, /module not registered/i)
    })

    it('should deal with nonexistent modules', function() {
        assert.throws(function() { ioc('libC') }, /cannot find module/i)
    })

    describe('.inject()', function() {
        it('should deal with anonymous modules', function() {
            ioc.inject(function(libA, libB) {
                assert.strictEqual(libA, _libA)
                assert.strictEqual(libB, _libB)
            })
        })
    })
})
