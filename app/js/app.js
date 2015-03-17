'use strict';

// Declare app level module which depends on views, and components
angular.module('rsvp', [
  'ngRoute',
  'rsvp.controllers',
  'rsvp.services'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/rsvp_home.html'});
    $routeProvider.when('/rsvp', {templateUrl: 'partials/rsvp_main.html', controller: 'MainWordController'});
    $routeProvider.when('/logs', {templateUrl: 'partials/rsvp_logs.html', controller: 'LogController'});
    $routeProvider.when('/calibrate/:device', {templateUrl: 'partials/rsvp_cal.html', controller: 'CalibrationController'});
    $routeProvider.when('/logs/:displayTrial', {templateUrl: 'partials/rsvp_trial.html', controller: 'TrialController'});
    $routeProvider.otherwise( {redirectTo: '/home'} );
}]);

String.prototype.endsWith = function(suffix){
    return this.indexOf(suffix , this.length - suffix.length) !== -1;
}

String.prototype.startsWith = function(str){
    return this.indexOf(str) == 0;
}
