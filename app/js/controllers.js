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
    var appearTime = 0;

    // networkService.init( 8181 , "192.168.150.2", "/api");

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

        //whatever it is save the duration
        appearTime = new Date().getTime();
    }

    wordFunctions.callbacks.onWordDissapeard = function(item){
        console.log('onWordDissapeard');
        //required not to resize the rectangle in the view. empty space
        
        $scope.word = String.fromCharCode(160);

         
        var data = {};
        data.Timestamp = new Date().getTime();
        data.Value = item;
        data.Duration = new Date().getTime() - appearTime;
        console.log(item);

        var wrapper = {};
        //TODO move this constant somewhere else
        wrapper.type = 'displayItem';
        wrapper.content = data;

        if( netParams.isCConnected )
            $scope.netFunctions.sendData(wrapper);

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
            if( netParams.isConnected )
                saveTrial();

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


    var saveTrial = function(){

        var trial = {};

        trial.trial = $scope.trial;
        trial.user_name = $scope.user_name;
        trial.user_age = $scope.user_age;
        trial.file_name = $scope.file_name; 
        trial.item_time = $scope.item_time; 
        trial.delay_time = $scope.delay_time; 
        trial.font_size = $scope.font_size; 
        trial.font_color = $scope.font_color; 
        trial.box_bg = $scope.box_bg; 
        trial.app_bg = $scope.app_bg; 
        trial.save_log = $scope.save_log; 

        var wrapper = {};
        //TODO move this constant somewhere else
        wrapper.type = 'configuration';
        wrapper.content = trial;

        $scope.netFunctions.sendData(wrapper);

    }

}])


.controller( 'LogController' , ['$scope' , 'NetworkService' , function( $scope , NetworkService ){
    
    var trials = [{'url':'something' , 'name':'one'} , {'url':'something2' , 'name':'two'}];

    $scope.trials = trials;

    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();
    // TODO check if the init is required again here
    NetworkService.init( 8181 , "192.168.150.2", "/api");

    netFunctions.connect( function(){
        netFunctions.log("Connected to server!");
        netParams.isConnected = true;
    }, function(){
        netFunctions.log("Connection failed!");
        netParams.isConnected = false;
    });

    netFunctions.onReceive = function(data){
        //TODO check with the server about the format of the message
        if( data.type === 'trials' )
            $scope.trials = data.trials;
    }

    var trialsRequest = {};
    trialsRequest.type = 'trials';
    trialsRequest.content = {};


    if( netParams.isCConnected )
        $scope.netFunctions.sendData(trialsRequest);

}])

.controller( 'TrialController' , ['$scope' , '$routeParams', 'NetworkService' , function( $scope , $routeParams , NetworkService ){
    
    $scope.trial = {};

    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();
    // TODO check if the init is required again here
    NetworkService.init( 8181 , "192.168.150.2", "/api");

    netFunctions.connect( function(){
        netFunctions.log("Connected to server!");
        netParams.isConnected = true;
    }, function(){
        netFunctions.log("Connection failed!");
        netParams.isConnected = false;
    });

    netFunctions.onReceive = function(data){
        //TODO check with the server about the format of the message
        if( data.type === 'trial' )
            $scope.trial = data.trial;
    }

    var trialName = $routeParams.displayTrial;


    var trialRequest = {};
    trialRequest.type = 'trial';
    trialRequest.content = {'name':trialName};

    if( netParams.isCConnected )
        $scope.netFunctions.sendData(trialRequest);
}]);

