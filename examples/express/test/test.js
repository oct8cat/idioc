'use strict';

var ioc = require('../ioc'),
    app = ioc('app'),
    supertest = ioc('$supertest'),
    assert = ioc('$assert')

var request = supertest(app())

describe('app', function() {
    describe('GET /', function() {
        it('should respond with "main"', function(done) {
            request.get('/').expect(200, function(err, res) {
                if (err) { done(err); return }
                assert.equal(res.body.response, 'main')
                done(err)
            })
        })
    })
    describe('GET /hello', function() {
        it('should respond with "hello"', function(done) {
            request.get('/hello').expect(200, function(err, res) {
                if (err) { done(err); return }
                assert.equal(res.body.response, 'hello')
                done(err)
            })
        })
    })
    describe('GET /404', function() {
        it('should respond with 404', function(done) {
            request.get('/404').expect(404, done)
        })
    })
})
