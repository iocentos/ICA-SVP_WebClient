'use strict';


angular.module('myApp.controllers', [])
.controller('MainWordController' , ['$scope' , 'MainWordService' , function($scope , MainWordService){

    $scope.word = 'Welcome';

    var words = ['one' , 'two' , 'three' , 'four' , 'five' , 'six' , 'seven' , 'eight' , 'nine' , 'ten'];

    MainWordService.init(0 , 1000 , words);

    var wordFunctions = MainWordService.getFunctions();

    wordFunctions.callbacks.onWordDisplayed = function(word){
        $scope.word = word;
    }

    wordFunctions.start();


}]);


