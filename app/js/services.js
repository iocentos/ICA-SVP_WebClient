'use strict';


var serviceModule = angular.module('myApp.services', []);

serviceModule.factory('testService', ['$scope', function($scope){

    return {
        setMousePosition: function() {
            console.log('testservice');
        }
    }

}]);

