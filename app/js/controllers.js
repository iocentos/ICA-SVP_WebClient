'use strict';

//network message types
var NET_TYPE_STREAM = 'stream';
var NET_TYPE_TRIALS = 'trials';
var NET_TYPE_SINGLE_TRIAL = 'trial';
var NET_TYPE_TRIAL_CONFIG = 'config';
var NET_TYPE_SERVICE_STARTED = 'serviceStarted';
var NET_TYPE_SERVICE_STOPPED = 'serviceStopped';
var NET_TYPE_SERVICE_PAUSED = 'servicePaused';
var NET_TYPE_SERVICE_RESUMED = 'serviceResumed';
var NET_TYPE_CALIBRATION = "calibration";


var TYPE_CALIBRATION_FINISHED = "calbrationFinished";
var TYPE_CALIBRATION_STARTED = "calbrationStarted";
var TYPE_EYETRIBE_CALIBRATION = "eyetribe";
var TYPE_SYSTEM_CALIBRATION = "system";


var SERVER_HOST = "127.0.0.1";
var SERVER_PORT = 8181;
var SERVER_URL = "/api";

var DSPL_ITEM_WORD = 'word';
var DSPL_ITEM_IMG = 'img';



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
    $scope.trial.save_log = true;

    var wordFunctions = MainWordService.getFunctions();
    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();
    //global to keep the start time of the word
    var appearTime = 0;

    if( !netParams.isConnected ){
        console.log('main controller net is not connected');
        NetworkService.init( SERVER_PORT ,SERVER_HOST,SERVER_URL);

        netFunctions.connect( function(){
            netFunctions.log("Connected to server!");
            netParams.isConnected = true;
        }, function(){
            netFunctions.log("Connection failed!");
            netParams.isConnected = false;
        });
    }

    wordFunctions.callbacks.onWordDisplayed = function(item){
        if( item.type === DSPL_ITEM_WORD ){
            $scope.word = item.value;
            //call this to check if a digest is already in progress
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        }
        else if( item.type === DSPL_ITEM_IMG ){
            //TODO
        }

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
        wrapper.type = NET_TYPE_STREAM;
        wrapper.content = data;

        if( netParams.isConnected )
            netFunctions.sendData(wrapper);
    }

    wordFunctions.callbacks.onServiceStarted = function(){
        console.log('Display service started');
        //the config message is the start message for the server
        //notifyServer(NET_TYPE_SERVICE_STARTED);
    }

    wordFunctions.callbacks.onServiceStopped = function(){
        console.log('Display service stopped');
        notifyServer(NET_TYPE_SERVICE_STOPPED);
    }

    wordFunctions.callbacks.onServicePaused = function(){
        console.log('Display service paused');
        //notifyServer(NET_TYPE_SERVICE_PAUSED);
    }
    
    wordFunctions.callbacks.onServiceResumed = function(){
        console.log('Display service resumed');
        //notifyServer(NET_TYPE_SERVICE_RESUMED);
    }

    var notifyServer = function(type){ 
        var wrapper = {};
        wrapper.type = type;
        var timestamp = new Date().getTime();
        wrapper.content = {'timestamp' : timestamp};

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
        wrapper.type = NET_TYPE_TRIAL_CONFIG;
        wrapper.content = $scope.trial;

        netFunctions.sendData(wrapper);
    }

}])

.controller( 'LogController' , ['$scope' , 'NetworkService' , function( $scope , NetworkService ){

    $scope.list_of_trials = {};

    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();

    var makeRequest = function(){
        var trialsRequest = {};
        trialsRequest.type = NET_TYPE_TRIALS;
        trialsRequest.content = {};
        netFunctions.sendData(trialsRequest);
    };

    if( netParams.isConnected ){
        console.log('log controller net is  connected');
        makeRequest();
    }else{
        console.log('log controller net is not connected');
        NetworkService.init( SERVER_PORT ,SERVER_HOST,SERVER_URL);
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
        if( data.type === NET_TYPE_TRIALS ){
            $scope.list_of_trials = data.trials;
            $scope.$apply();
        }
    };

}])

.controller( 'CalibrationController', ['$scope' ,'$location','$routeParams', 'NetworkService', function($scope, $location, $routeParams, NetworkService){

    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();

    var makeRequest = function(){
        var calibrationRequest = {};
        calibrationRequest.type = NET_TYPE_CALIBRATION;
        calibrationRequest.content = $routeParams.device;
        netFunctions.sendData(calibrationRequest);
    };

    var onCalibrationFinished = function(){
        $location.path("home")
    };

    var onCalibrationStarted = function(){

    }

    if( netParams.isConnected ){
        console.log('trial controller net is  connected');
        makeRequest();
    }
    else{
        console.log('trial controller net is  not connected');
        NetworkService.init( SERVER_PORT ,SERVER_HOST,SERVER_URL);
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
        if( data.type === NET_TYPE_CALIBRATION ){
            if( data.content === TYPE_CALIBRATION_STARTED )
                onCalibrationStarted();
            else if( data.content === TYPE_CALIBRATION_FINISHED )
                onCalibrationFinished();
        }
    }
}])

.controller( 'TrialController' , ['$scope' , '$routeParams', 'NetworkService' , function( $scope , $routeParams , NetworkService ){

    $scope.trial = {};

    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();

    var makeRequest = function(){
        var trialRequest = {};
        trialRequest.type = NET_TYPE_SINGLE_TRIAL;
        trialRequest.content =$routeParams.displayTrial;
        netFunctions.sendData(trialRequest);
    };

    if( netParams.isConnected ){
        console.log('trial controller net is  connected');
        makeRequest();
    }
    else{
        console.log('trial controller net is  not connected');
        //TODO remove the hardcoded ip
        NetworkService.init( SERVER_PORT ,SERVER_HOST,SERVER_URL);
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
        if( data.type === NET_TYPE_SINGLE_TRIAL ){
            $scope.trial = data.trial;
            $scope.$apply();
        }
    }

}]);

