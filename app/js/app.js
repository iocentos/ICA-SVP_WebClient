'use strict';

// Declare app level module which depends on views, and components
angular.module('svp', [
  'ngRoute',
  'svp.controllers',
  'svp.services'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/svp_home.html', controller: 'HomeController'});
    $routeProvider.when('/svp', {templateUrl: 'partials/svp_main.html', controller: 'MainWordController'});
    $routeProvider.when('/logs', {templateUrl: 'partials/svp_logs.html', controller: 'LogController'});
    $routeProvider.when('/calibrate/system', {templateUrl: 'partials/svp_cal.html', controller: 'SystemCalibrationController'});
    $routeProvider.when('/logs/:displayTrial', {templateUrl: 'partials/svp_trial.html', controller: 'TrialController'});
    $routeProvider.otherwise( {redirectTo: '/home'} );
}]);

String.prototype.endsWith = function(suffix){
    return this.indexOf(suffix , this.length - suffix.length) !== -1;
}

String.prototype.startsWith = function(str){
    return this.indexOf(str) == 0;
}
