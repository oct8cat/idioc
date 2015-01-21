module.exports = function(grunt) { 'use strict';
    grunt.initConfig({
        jshint: {
            lib: ['lib/**/*.js', 'Gruntfile.js'],
            test: ['test/**/*.js'],
            options: {
                node: true,
                globalstrict: true,
                asi: true
            }
        }
    })
    
    grunt.loadNpmTasks('grunt-contrib-jshint')
}