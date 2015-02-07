'use strict';


angular.module('rvsp.controllers', [])
.controller('MainWordController' , ['$scope' , 'MainWordService' , function($scope , MainWordService){

    $scope.word = 'Welcome';

    var words = ['one' , 'two' , 'three' , 'four' , 'five' , 'six' , 'seven' , 'eight' , 'nine' , 'ten' , '11' , '12' , '13' , '14' , '15' , '16' , '18' , 'skata' , 
            'yo', 'ua' , '1' , '2 ' , '3' ];

    MainWordService.init(0 , 2000 , words);

    var wordFunctions = MainWordService.getFunctions();

    wordFunctions.callbacks.onWordDisplayed = function(word){
        $scope.word = word;
    }



    $scope.start = function(){
        wordFunctions.start();
    }

    $scope.stop = function(){
        wordFunctions.stop();
    }

    $scope.pause = function(){
        wordFunctions.pause();
    }

    $scope.restart = function(){
        wordFunctions.restart();
    }


}]);


