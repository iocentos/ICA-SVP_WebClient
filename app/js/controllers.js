'use strict';

angular.module('rsvp.controllers', [])
.controller('MainWordController' , ['$scope' , 'MainWordService' , 'NetworkService' , function($scope , MainWordService, NetworkService){

    $scope.trial = {};

    $scope.word = 'Welcome';
    $scope.trial.trial;
    $scope.trial.user_name;
    $scope.trial.user_age;
    $scope.trial.file_name;
    $scope.trial.item_time;
    $scope.trial.delay_time;
    $scope.trial.font_size;
    $scope.trial.font_color;
    $scope.trial.box_bg;
    $scope.trial.app_bg;
    $scope.trial.save_log;

    var wordFunctions = MainWordService.getFunctions();
    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();
    //global to keep the start time of the word
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
            file = $scope.trial.file_name
        else
            file = 'content/default.json';

        $.getJSON(file , function(data){
            console.log('Content loaded from ' + file);
            MainWordService.init($scope.trial.delay_time , $scope.trial.item_time , data);
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

        var wrapper = {};
        //TODO move this constant somewhere else
        wrapper.type = 'configuration';
        wrapper.content = $scope.trial;

        $scope.netFunctions.sendData(wrapper);
    }

}])


.controller( 'LogController' , ['$scope' , 'NetworkService' , function( $scope , NetworkService ){

    $scope.list_of_trials = [{'name':'one'} , {'name':'two'} ,{'name':'three'} ,{'name':'four'} ,{'name':'five'} ,{'name':'fuck you daniel'}];

    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();
    // TODO check if the init is required again here
    NetworkService.init( 8181 , "192.168.150.2", "/api");

    if( netParams.isConnected ){
        makeRequest();
    }else{
        netFunctions.connect( function(){
            netFunctions.log("Connected to server!");
            netParams.isConnected = true;
            makeRequest();
        }, function(){
            netFunctions.log("Connection failed!");
            netParams.isConnected = false;
        });
    }

    netFunctions.onReceive = function(data){
        //TODO check with the server about the format of the message
        if( data.type === 'trials' )
            $scope.list_of_trials = data.trials;
    };

    var makeRequest = function(){
        var trialsRequest = {};
        trialsRequest.type = 'trials';
        trialsRequest.content = {};
        $scope.netFunctions.sendData(trialsRequest);
    };
}])

.controller( 'TrialController' , ['$scope' , '$routeParams', 'NetworkService' , function( $scope , $routeParams , NetworkService ){

    $scope.trial = {};

    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();
    // TODO check if the init is required again here
    NetworkService.init( 8181 , "192.168.150.2", "/api");


    if( netParams.isConnected )
        makeRequest();
    else{
        netFunctions.connect( function(){
            netFunctions.log("Connected to server!");
            netParams.isConnected = true;
        }, function(){
            netFunctions.log("Connection failed!");
            netParams.isConnected = false;
        });
    }

    netFunctions.onReceive = function(data){
        //TODO check with the server about the format of the message
        if( data.type === 'trial' )
            $scope.trial = data.trial;
    }

    var makeRequest = function(){
        var trialRequest = {};
        trialRequest.type = 'trial';
        trialRequest.content = {'name':$routeParams.displayTrial};
        $scope.netFunctions.sendData(trialRequest);
    }
}]);

