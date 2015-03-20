'use strict';

var SERVER_HOST = server.ip;
var SERVER_PORT = server.port;
var SERVER_URL = server.url;

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

var TYPE_CALIBRATION_FINISHED = "calibrationFinished";
var TYPE_CALIBRATION_STARTED = "calibrationStarted";
var TYPE_EYETRIBE_CALIBRATION = 0;
var TYPE_SYSTEM_CALIBRATION = 1;

var DSPL_ITEM_WORD = 'word';
var DSPL_ITEM_IMG = 'img';

var BACKGROUND_STATIC = 0;
var BACKGROUND_BRIGHT = 1;
var BACKGROUND_OBSCURE = 2;

angular.module('rsvp.controllers', [])

.controller('HomeController' , ['$rootScope', '$scope', 'NetworkService',function($rootScope, $scope, NetworkService){
	if(!$rootScope.calibration){
    	$rootScope.calibration = {};
    	$rootScope.calibration.bg_color;
	}


    /*
     * The code below is handling the request for the eye tribe
     * calibration. 
     */
    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();

    $scope.makeRequest = function(){
        if( netParams.isConnected ){
            var calibrationRequest = {};
            calibrationRequest.type = NET_TYPE_CALIBRATION;
            calibrationRequest.content = "{'calibration_type':" + TYPE_EYETRIBE_CALIBRATION + "}";

            netFunctions.sendData(calibrationRequest); 
        }
    }

    if( netParams.isConnected ){
        console.log('trial controller net is  connected');
    }
    else{
        console.log('trial controller net is  not connected');
        NetworkService.init( SERVER_PORT ,SERVER_HOST,SERVER_URL);
        netFunctions.connect( function(){
            netFunctions.log("Connected to server!");
            netParams.isConnected = true;
        }, function(){
            netFunctions.log("Connection failed!");
            netParams.isConnected = false;
        });
    }
}])

.controller('MainWordController' , ['$rootScope', '$scope' ,  '$location', 'MainWordService' , 'NetworkService' ,'BgColorService', function($rootScope, $scope ,$location, MainWordService, NetworkService, BgColorService){

    $scope.trial = {};
    $scope.word = defaults.message_start;
    $scope.trial.trial;
    $scope.trial.file_name;
    $scope.trial.item_time = defaults.item_time;
    $scope.trial.delay_time = defaults.delay_time;
    $scope.trial.user_name;
    $scope.trial.user_age;
    $scope.trial.font_size = defaults.font_size;
    $scope.trial.font_color = defaults.font_color;
    $scope.trial.app_bg = defaults.app_color;
    $scope.trial.bg_modality = defaults.bg_modality;
    $scope.trial.padding = defaults.padding;
    $scope.trial.window = defaults.window;
    $scope.trial.save_log = true;

    if($rootScope.calibration.bg_color)
        $scope.trial.cal_bg = $rootScope.calibration.bg_color;
    else
        $location.path("/calibrate/system");

    var wordFunctions = MainWordService.getFunctions();
    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();
    //global to keep the start time of the word
    var appearTime = 0;

    var colorFunctions = BgColorService.getPublicFunctions();

    colorFunctions.onUpdate = function(color){
        updateBgColor(color);        
    }

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
        }
        else if( item.type === DSPL_ITEM_IMG ){
            $scope.image = item.value;
        }
        if(!$scope.$$phase) {
            $scope.$apply();
        }
        //whatever it is save the duration
        appearTime = new Date().getTime();
    }

    wordFunctions.callbacks.onWordDissapeard = function(item){
        //required not to resize the rectangle in the view. empty space
        $scope.word = String.fromCharCode(160);
        $scope.image = "";

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
        trialFinished();
        $location.path("/home");
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
        if( $scope.trial.file_name ) 
            file = $scope.trial.file_name
        else
            file = defaults.content;

        $.getJSON( file, null)
            .done(function( data ) {
                console.log('Content loaded from ' + file);
                MainWordService.init($scope.trial.delay_time , $scope.trial.item_time , data);

                if( $scope.trial.bg_modality == BACKGROUND_BRIGHT){
                    BgColorService.init(data.length, $scope.trial.item_time ,
                                        $scope.trial.delay_time , $scope.trial.app_bg,
                                        BACKGROUND_BRIGHT);
                }else if ( $scope.trial.bg_modality == BACKGROUND_OBSCURE){
                    BgColorService.init(data.length, $scope.trial.item_time ,
                                        $scope.trial.delay_time , $scope.trial.app_bg,
                                        BACKGROUND_OBSCURE);
                }

                if( netParams.isConnected )
                    saveTrial();

                wordFunctions.start();
                colorFunctions.start();
            })
            .fail(function( jqxhr, textStatus, error ) {
                alert(file + "does not exist");
                $('#config_modal').reveal();
            });
    }

    $scope.stop = function(){
        wordFunctions.stop();
    }

    $scope.pause = function(){
        wordFunctions.pause();
        if( $scope.trial.bg_modality != BACKGROUND_STATIC)
            colorFunctions.stop();
    }

    $scope.restart = function(){
        wordFunctions.restart();
    }

    $scope.resume = function(){
        wordFunctions.resume();
        if( $scope.trial.bg_modality != BACKGROUND_STATIC)
            colorFunctions.start();
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

.controller( 'SystemCalibrationController', ['$rootScope','$scope' ,'$location','$routeParams', 'NetworkService', function($rootScope,$scope, $location, $routeParams, NetworkService){

    var netFunctions = NetworkService.getNetworkFunctions();
    var netParams = NetworkService.getNetworkParams();

    $rootScope.calibration.bg_color = defaults.cal_color;

    $scope.makeRequest = function(){
        var calibrationRequest = {};
        calibrationRequest.type = NET_TYPE_CALIBRATION;
        calibrationRequest.content = "{'calibration_type':" + TYPE_SYSTEM_CALIBRATION + "}";
        netFunctions.sendData(calibrationRequest);
    };

    var onCalibrationFinished = function(){
        console.log("Calibration finished");
        if(calibrationFinished)
        	$location.path("/home");
    };

    var onCalibrationStarted = function(){
        console.log("Calibration started");
    }

    if( netParams.isConnected ){
        console.log('trial controller net is  connected');
    }
    else{
        console.log('trial controller net is  not connected');
        NetworkService.init( SERVER_PORT ,SERVER_HOST,SERVER_URL);
        netFunctions.connect( function(){
            netFunctions.log("Connected to server!");
            netParams.isConnected = true;
        }, function(){
            netFunctions.log("Connection failed!");
            netParams.isConnected = false;
        });

    }

    netFunctions.onReceive = function(data){
        if( data.type === NET_TYPE_CALIBRATION ){
        console.log(data)
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
