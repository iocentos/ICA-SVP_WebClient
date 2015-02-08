'use strict';

angular.module('rsvp.controllers', [])
.controller('MainWordController' , ['$scope' , 'MainWordService' , 'NetworkService' , function($scope , MainWordService, NetworkService){

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

    var wordFunctions = MainWordService.getFunctions();
    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();

    netFunctions.connect( function(){
        netFunctions.log("Connected to server!");
        netParams.isConnected = true;
    }, function(){
        netFunctions.log("Connection failed!");
        netParams.isConnected = false;
    });

    //TODO make the callbacks to the server
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
        var file;
        if( $scope.file_name ) 
            file = $scope.file_name
        else
            file = 'content/default.json';

        $.getJSON(file , function(data){
            console.log('Content loaded from ' + $scope.file_name);
            MainWordService.init($scope.delay_time , $scope.item_time , data);
            wordFunctions.start();
        });
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

    $scope.isRunning = function(){
        return wordFunctions.isRunning();
    }

}]);