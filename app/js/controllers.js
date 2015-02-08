'use strict';


angular.module('rvsp.controllers', [])
.controller('MainWordController' , ['$scope' , 'MainWordService' , function($scope , MainWordService){

    $scope.word = 'Welcome';
    $scope.trial;
    $scope.user_name;
    $scope.user_age;
    $scope.file_name;
    $scope.item_time;
    $scope.delay_time;
    $scope.font_size;
    $scope.font_color;
    $scope.box_bg;
    $scope.app_bg;
    $scope.save_log;

    var content = [ {"type":"word" , "value":"one"} , {"type":"word" , "value":"two"} , {"type":"word" , "value":"three"} , {"type":"word" , "value":"four"} , {"type":"word" , "value":"five"} , {"type":"word" , "value":"six"} , {"type":"word" , "value":"seven"} , {"type":"word" , "value":"eight"} , {"type":"word" , "value":"nine"} , {"type":"word" , "value":"ten"} ];

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
    	 MainWordService.init($scope.delay_time , $scope.item_time , content);
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

    $scope.resume = function(){
        wordFunctions.resume();
    }

}]);


