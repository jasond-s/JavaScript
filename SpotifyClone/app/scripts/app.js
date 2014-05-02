'use strict';

// If in nodejs then the module exports will play nicely otherwise in browser these need defining.
var module = module || {};
var exports = module.exports || {};

var app = angular.module('angularTesterApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
]);