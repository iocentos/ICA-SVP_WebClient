'use strict';


var serviceModule = angular.module('rvsp.services', []);

/*
 *  Service that will handle all the timing of the words. It will have
 *  several kinds of callbacks that the called need to provide.
 */
serviceModule.factory('MainWordService', ['$rootScope' , '$interval' , function($rootScope, $interval){

    var functions = {};
    functions.callbacks = {};
    var parameters = {};
    var privateFunctions = {};

    functions.callbacks.onWordDisplayed = function(){};
    functions.callbacks.onWordDissapeard = function(){};
    functions.callbacks.onDelayStarted = function(){};
    functions.callbacks.onDelayStopped = function(){};
    functions.callbacks.onServiceStarted = function(){};
    functions.callbacks.onServiceStopped = function(){};
    functions.callbacks.onServicePaused = function(){};


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

        if( !functions.isRunning() ){
            functions.callbacks.onServiceStarted();

            if(functions.isFinished())
                functions.restart();
            else{
                privateFunctions.start();
            }
        }
    }

    functions.stop = function(){

        if( functions.isRunning && ! functions.isFinished()){
            functions.callbacks.onServiceStopped();
            privateFunctions.stop();
        }
    }

    functions.pause = function(){
        if( functions.isRunning() && !functions.isFinished() ){
            functions.callbacks.onServicePaused();
            privateFunctions.pause(); 
        }
    }

    functions.isFinished = function(){
        return parameters.index == parameters.words.length;
    }

    functions.restart = function(){
        privateFunctions.restart();
        functions.stop();
        functions.start();
    }

    functions.isRunning = function(){
        return parameters.isRunning;
    }


    /*****************************
     * PRIVATE METHODS
     * **************************/

    privateFunctions.restart = function(){
        parameters.index = 0; 
        parameters.isRunning = false;
    }


    privateFunctions.start = function(){
        parameters.isRunning = true;
        privateFunctions.setTimer();
    }

    privateFunctions.setTimer = function(){
        parameters.promise = $interval(function(){
            if( !functions.isFinished() ){
                var word = parameters.words[parameters.index];
                parameters.index++;
                privateFunctions.updateWord(word);
            }else{
                privateFunctions.stop();
            }
        }, parameters.wordDisplayTimeMs)
          
    }

    privateFunctions.stop = function(){
        if( parameters.isRunning ){
            $interval.cancel(parameters.promise);
            parameters.isRunning = false;
        }
    }
    
    privateFunctions.pause = function(){
        if( parameters.isRunning )
            privateFunctions.stop();
        else
            privateFunctions.start();
    }

    privateFunctions.updateWord = function(word){
        functions.callbacks.onWordDisplayed(word);
    }

    privateFunctions.restart = function(){
        parameters.isRunning = false;
        parameters.index = 0;
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
serviceModule.factory('networkService', ['$rootScope', 'spritzService', 'loggingService', function($rootScope, spritzService, loggingService) {

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

