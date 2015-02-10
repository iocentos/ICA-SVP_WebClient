'use strict';

var TYPE_STREAM = 'stream';
var TYPE_TRIALS = 'trials';
var TYPE_SINGLE_TRIAL = 'trial';
var TYPE_TRIAL_CONFIG = 'config';

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

    if( !netParams.isConnected ){
        console.log('main controller net is not connected');
        NetworkService.init( 8181 , "192.168.150.4", "/api");

        netFunctions.connect( function(){
            netFunctions.log("Connected to server!");
            netParams.isConnected = true;
        }, function(){
            netFunctions.log("Connection failed!");
            netParams.isConnected = false;
        });
    }

    wordFunctions.callbacks.onWordDisplayed = function(item){
        if( item.type === 'word' )
            $scope.word = item.value;

        //whatever it is save the duration
        appearTime = new Date().getTime();
    }

    wordFunctions.callbacks.onWordDissapeard = function(item){
        //required not to resize the rectangle in the view. empty space

        $scope.word = String.fromCharCode(160);

        var data = {};
        data.Timestamp = new Date().getTime();
        data.Value = item;
        data.Duration = new Date().getTime() - appearTime;

        var wrapper = {};
        wrapper.type = TYPE_STREAM;
        wrapper.content = data;

        if( netParams.isConnected )
            netFunctions.sendData(wrapper);
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
        wrapper.type = TYPE_TRIAL_CONFIG;
        wrapper.content = $scope.trial;

        netFunctions.sendData(wrapper);
    }

}])

.controller( 'LogController' , ['$scope' , 'NetworkService' , function( $scope , NetworkService ){

    // $scope.list_of_trials = [{'name':'one'} , {'name':'two'} ,{'name':'three'} ,{'name':'four'} ,{'name':'five'} ,{'name':'fuck you daniel'}];

    $scope.list_of_trials = {};

    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();

    var makeRequest = function(){
        var trialsRequest = {};
        trialsRequest.type = TYPE_TRIALS;
        trialsRequest.content = {};
        netFunctions.sendData(trialsRequest);
    };

    if( netParams.isConnected ){
        console.log('log controller net is  connected');
        makeRequest();
    }else{
        console.log('log controller net is not connected');
        //TODO remove the hardcoded ip
        NetworkService.init( 8181 , "192.168.150.4", "/api");
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
        if( data.type === TYPE_TRIALS ){
            $scope.list_of_trials = data.trials;
            $scope.$apply();
        }
    };

}])

.controller( 'TrialController' , ['$scope' , '$routeParams', 'NetworkService' , function( $scope , $routeParams , NetworkService ){

    $scope.trial = {};

    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();

    var makeRequest = function(){
        var trialRequest = {};
        trialRequest.type = TYPE_SINGLE_TRIAL;
        trialRequest.content = {'name':$routeParams.displayTrial};
        netFunctions.sendData(trialRequest);
    };

    if( netParams.isConnected ){
        console.log('trial controller net is  connected');
        makeRequest();
    }
    else{
        console.log('trial controller net is  not connected');
        //TODO remove the hardcoded ip
        NetworkService.init( 8181 , "192.168.150.4", "/api");
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
        if( data.type === TYPE_SINGLE_TRIAL )
            $scope.trial = data.trial;
    }

}]);

