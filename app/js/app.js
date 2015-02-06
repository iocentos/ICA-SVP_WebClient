'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.controllers',
  'myApp.services'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/test', {templateUrl: 'partials/test.html', controller: 'MainWordController'});
    $routeProvider.otherwise( {redirectTo: '/test'} );
}]);
