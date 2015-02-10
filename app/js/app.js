'use strict';

// Declare app level module which depends on views, and components
angular.module('rsvp', [
  'ngRoute',
  'rsvp.controllers',
  'rsvp.services'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/rsvp', {templateUrl: 'partials/rsvp_main.html', controller: 'MainWordController'});
    $routeProvider.when('/logs', {templateUrl: 'partials/rsvp_logs.html', controller: 'LogController'});
    $routeProvider.when('/logs/:displayTrial', {templateUrl: 'partials/rsvp_trial.html', controller: 'TrialController'});
    $routeProvider.otherwise( {redirectTo: '/rsvp'} );
}]);
