'use strict';



var serviceModule = angular.module('rsvp.services', []);

/*
 *  Service that will handle all the timing of the words. It will have
 *  several kinds of callbacks that the called need to provide.
 */
serviceModule.factory('MainWordService', ['$rootScope' , '$timeout' , '$interval' , function($rootScope, $timeout , $interval){

    var functions = {};
    functions.callbacks = {};
    var parameters = {};
    var privateFunctions = {};

    functions.callbacks.onWordDisplayed = function(){};
    functions.callbacks.onWordDissapeard = function(){};
    functions.callbacks.onServiceStarted = function(){};
    functions.callbacks.onServiceStopped = function(){};
    functions.callbacks.onServicePaused = function(){};
    functions.callbacks.onServiceResumed = function(){};


    parameters.delayBtnWords = 0;
    parameters.wordDisplayTimeMs = 0;
    parameters.words = [];
    parameters.index = 0;
    parameters.isRunning = false;
    parameters.promise = {};


    /*****************************
     * PUBLIC METHODS
     * **************************/

    functions.start = function(){
        if( !functions.isFinished() && !functions.isRunning() ){
            console.log('Starting main service... ');
            functions.callbacks.onServiceStarted();
            functions.setRunningState(true);
            privateFunctions.tick();
        }
    }

    functions.stop = function(){
        if( !functions.isFinished() && functions.isRunning() ){
            console.log('Stopping main service... ');
            functions.callbacks.onServiceStopped();
            $interval.cancel(parameters.promise);
            functions.setRunningState(false);
            parameters.index = 0;
        }
    }

    functions.pause = function(){
        if( !functions.isFinished() && functions.isRunning() ){
            console.log('Calling pause on main service...');
            functions.callbacks.onServicePaused();
            $interval.cancel(parameters.promise);
            functions.setRunningState(false);
        }
    }

    functions.resume = function(){
        if( !functions.isFinished() && !functions.isRunning() ){
            console.log('Calling resume on main service...')
            functions.callbacks.onServiceResumed();
            functions.setRunningState(true);
            privateFunctions.tick();
        }
    }

    functions.restart = function(){
        functions.stop();
        functions.start();
    }

    functions.isFinished = function(){
        return parameters.index == parameters.words.length;
    }

    functions.isRunning = function(){
        return parameters.isRunning;
    }

    functions.setRunningState = function(state){
        parameters.isRunning = state;
    }

    /*****************************
     * PRIVATE METHODS
     * **************************/

    //this and the next method are calling each other in a recursive way,
    privateFunctions.tick = function(){
        
        if( functions.isFinished() ){
            functions.callbacks.onServiceStopped();
            return ;
        }


        //odd number is contetnt. even numbers are blanks
        if( !functions.isFinished() && functions.isRunning() ){
            var delay = 0;
            if( parameters.index % 2 ){//blank
                delay = parameters.delayBtnWords;
                //subtract one because the index has already been incremented
                functions.callbacks.onWordDissapeard(parameters.words[parameters.index - 1].value);
            }else{//content
                //make the callback and update also
                functions.callbacks.onWordDisplayed(parameters.words[parameters.index]);
                delay = parameters.wordDisplayTimeMs;
            }

            parameters.index++;

            privateFunctions.startTimer(delay);
        }
    }

    privateFunctions.startTimer = function(delay){
        parameters.promise = $interval(function(){
                privateFunctions.tick();
        }, delay, 1);
    }


    
    /*
     * Initialization method.
     * Params 
     *      delayBtnWords : Time in ms between each word is displayed (without time for displaying the word itself)
     *      wordDisplayTimeMs : Time in ms that each word should be displayd
     *      words : The array containing all the words
     */
    return {
        init : function(delayBtnWords , wordDisplayTimeMs , words){
            parameters.delayBtnWords = delayBtnWords;
            parameters.wordDisplayTimeMs = wordDisplayTimeMs;
            parameters.words = words;
            parameters.index = 0;
            parameters.isRunning = false;

            var newContent = [];

            //copy all words to a new array. odd numbers will be blanks. even numbers are content
            var j = 0;
            for( var i = 0 ; i < parameters.words.length ; i++){
                newContent[j++] = parameters.words[i];
                newContent[j++] = {'type':'blank' , 'value':'blank'};
            }

            parameters.words = newContent;

        },
        getPramaters : function(){
            return parameters;
        },
        getFunctions : function(){
            return functions;
        }
    }

}]);

/*
 *  Network service that will use web sockets.
 *  Every request to the server should be done through this service. 
 */
serviceModule.factory('NetworkService', ['$rootScope', function($rootScope) {

    var netParams = {};
    var netFunctions = {};


    netParams.port = 0;
    netParams.host = "";
    netParams.path = "";
    netParams.webSocket = null;
    netParams.log = true;
    netParams.isConnected = false;


    //    Network functions

    netFunctions.log =  function(data){
        if(netParams.log){
            console.log("NetworkService : " + data);
        }
    };

    netFunctions.getFullUrl = function(){

        if( netParams.host.endsWith('/') ){
            netParams.host = netParams.host.substring(0 , netParams.host.length -1 );
        }

        if( !netParams.host.startsWith('ws://')){
            var prot = 'ws://';
        netParams.host = prot.concat(netParams.host);
        }

        if( netParams.path.startsWith('/') )
            netParams.path = netParams.path.substring(1 , netParams.path.length );


        return netParams.host + ":" + netParams.port + "/" + netParams.path;
    };

    netFunctions.onNetWorkReceive = function (event){
        if( netFunctions.onReceive )
            netFunctions.onReceive(JSON.parse(event.data));
    };

    netFunctions.sendData = function(data){
        netParams.webSocket.send(JSON.stringify(data));
    };

    netFunctions.onReceive = function(obj){
        netFunctions.log("Received : " + obj.Timestamp + "   Word : " + obj.Value);
    };



    netFunctions.connect = function(onConnected , onConnectionFailed){
        netFunctions.log("Connecting to the server at " + netFunctions.getFullUrl());
        netParams.webSocket = new WebSocket(netFunctions.getFullUrl());
        netParams.webSocket.onopen = onConnected;
        netParams.webSocket.onerror = onConnectionFailed;
        netParams.webSocket.onmessage = netFunctions.onNetWorkReceive;
    };

    /*
     * netFunctions.close = function(){
     * 	netParams.webSocket.close();

     * };
     */



    return {
        init : function(port , serverUrl , path){
            netFunctions.log("Init");
            netParams.port = port;
            netParams.path = path;
            netParams.host = serverUrl;

        },
        getNetworkParams : function(){
            return netParams;
        },
        getNetworkFunctions : function(){
            return netFunctions;
        }
    }

}]);

serviceModule.factory('BgColorService' , ['$timeout' , '$interval' , function($timeout, $interval) {


    var BRIGHT_MODE = true;
    var OBSCURE_MODE = false;

    var CONSTANT_INTERVAL = 100; //update color every 100ms

    var bgColor = {};
    bgColor.initialRGBColor = 0;
    bgColor.currentRGBColor = 0;
    bgColor.initialHSVColor = 0;
    bgColor.currentHSVColor = 0;

    bgColor.mode = BRIGHT_MODE;
    bgColor.totalTime = 0;
    bgColor.elapsedTime = 0;
    bgColor.iterations = 0;
    bgColor.promise = {};
    bgColor.counter = 0;
    bgColor.colorInterval = 0;

    var privateFunctions = {};
    var publicFunctions = {};

    publicFunctions.isRunning = false;
    publicFunctions.isFinished = false;

    /*
     * Public functions
     */
    publicFunctions.onUpdate = function(color){
        console.log(color);
    }

    publicFunctions.start = function(){
        if( !publicFunctions.isRunning && !publicFunctions.isFinished ){
            publicFunctions.isRunning = true;
            privateFunctions.start(CONSTANT_INTERVAL);
        }
    }

    publicFunctions.stop = function(){
        if( publicFunctions.isRunning ){
            publicFunctions.isRunning = false;
            $interval.cancel(bgColor.promise);
        }
    }

    /*
     * Private functions
     */
    privateFunctions.tick = function(){
        if(publicFunctions.isRunning && !publicFunctions.isFinished){

            if( bgColor.counter < bgColor.iterations ){

                if( bgColor.mode == BRIGHT_MODE )
                    bgColor.currentHSVColor.v = parseFloat(bgColor.colorInterval) + parseFloat(bgColor.currentHSVColor.v);
                else if( bgColor.mode == OBSCURE_MODE )
                    bgColor.currentHSVColor.v = parseFloat(bgColor.currentHSVColor.v) -  parseFloat(bgColor.colorInterval);

                if (parseFloat(bgColor.currentHSVColor.v) < 100 ){
                    var color = tinycolor(bgColor.currentHSVColor);
                    var rgb = color.toRgb();

                    //console.log( bgColor.currentHSVColor );

                    bgColor.currentRGBColor = rgb;

                    var newColor = '#' + rgb.r + rgb.g + rgb.b;

                    publicFunctions.onUpdate(newColor);

                    bgColor.counter++;
                    privateFunctions.start(CONSTANT_INTERVAL);
                }else{
                    publicFunctions.isFinished = true;
                    publicFunctions.stop();
                }
            }else{
                publicFunctions.isFinished = true;
                publicFunctions.stop();
            }
        }
    }

    privateFunctions.start = function(delay){
        bgColor.promise = $interval(function(){
            privateFunctions.tick();
        },delay, 1 );
    }




    return {
        init : function(stimuliCount, stimuliTime, delayTime, initialColor, mode){
            bgColor.initialRGBColor = initialColor;
            bgColor.currentRGBColor = initialColor;
            var rgbColor = tinycolor(initialColor);
            bgColor.initialHSVColor = rgbColor.toHsv();
            bgColor.currentHSVColor = bgColor.initialHSVColor;

            bgColor.mode = mode;

            bgColor.totalTime = (stimuliCount * stimuliTime) + ((stimuliCount - 1) * delayTime);

            bgColor.iterations = bgColor.totalTime / CONSTANT_INTERVAL;

            var value = bgColor.initialHSVColor.v;
            if( bgColor.mode == BRIGHT_MODE ){
                bgColor.colorInterval = (100-parseFloat(value) * 100) / bgColor.iterations;    
            }else if( bgColor.mode == OBSCURE_MODE ){
                bgColor.colorInterval = (parseFloat(value) *100) / bgColor.iterations;    
            }

            bgColor.currentHSVColor.v = parseFloat(bgColor.currentHSVColor.v) * 100;

            privateFunctions.start(CONSTANT_INTERVAL);
        },
        getPublicFunctions : function(){
            return publicFunctions;
        }
    }

}]);
