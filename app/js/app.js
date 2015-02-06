'use strict';

// Declare app level module which depends on views, and components
angular.module('rvsp', [
  'ngRoute',
  'rvsp.controllers',
  'rvsp.services'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/rvsp', {templateUrl: 'partials/rvsp_main.html', controller: 'MainWordController'});
    $routeProvider.otherwise( {redirectTo: '/rvsp'} );
}]);
