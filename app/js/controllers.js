'use strict';


angular.module('rvsp.controllers', [])
.controller('MainWordController' , ['$scope' , 'MainWordService' , function($scope , MainWordService){

    $scope.word = 'Welcome';


    var content = [ {"type":"word" , "value":"one"} , {"type":"word" , "value":"two"} , {"type":"word" , "value":"three"} , {"type":"word" , "value":"four"} , {"type":"word" , "value":"five"} , {"type":"word" , "value":"six"} , {"type":"word" , "value":"seven"} , {"type":"word" , "value":"eight"} , {"type":"word" , "value":"nine"} , {"type":"word" , "value":"ten"} ];


    MainWordService.init(3000 , 6000 , content);

    var wordFunctions = MainWordService.getFunctions();

    wordFunctions.callbacks.onWordDisplayed = function(item){

        console.log('onWordDisplayed');
        if( item.type === 'word' )
            $scope.word = item.value;
    }

    wordFunctions.callbacks.onWordDissapeard = function(item){
        console.log('onWordDissapeard');
        $scope.word = String.fromCharCode(160);
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


