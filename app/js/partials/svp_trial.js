
var TITLE_ORIGINAL = "Original data";
var TITLE_PROCESSED = "Processed data";
var UNIT = "mm";
var LABEL_X = "Time(ms)";
var LABEL_Y = "Dilation(mm)";
var LABEL_EYE_LEFT = "Left eye";
var LABEL_EYE_RIGHT = "Right eye";
var LABEL_DELAY = "DELAY";
var GRAPH_CONTAINER_ORIGINAL = "original";
var GRAPH_CONTAINER_PROCESSED = "processed";
var PARAM_EYES = "eyes";
var PARAM_VALUE = "value";
var MARKER_IMG = "url(" + defaults.marker_url + ")";
var scp;

$(document).ready(function(){
    $('body').css("background-color","#FFFFFF");
    setTimeout(function(){ 
        scp = angular.element('.main').scope(); 
        Graph(scp.trial);
        setGradientBackground(scp.trial.configuration.app_bg , scp.trial.configuration.bg_modality);
    }, 500);
});

function Graph(trial){
	//Graph data
	var data_original_left = [];
	var data_original_right = [];
	var data_processed_left = [];
	var data_processed_right = [];

    $.each(trial.data, function( index, value ){
        var item = value.item;
        //If null, set delay as value
        if(item.value == null)
            item[PARAM_VALUE] = LABEL_DELAY;
       	//Format original data to graph
    	$.each($(value[PARAM_EYES]), function( index, eyes ){
    			data_original_left.push(formatInput(item, eyes.timestamp, eyes.left_eye, index));
    			data_original_right.push(formatInput(item, eyes.timestamp, eyes.right_eye, index));
    			data_processed_left.push(formatInput(item, eyes.timestamp, eyes.left_eye_processed, index));
    			data_processed_right.push(formatInput(item, eyes.timestamp, eyes.right_eye_processed, index));
    	 });
    });
	//Draw graphs
	drawGraph(GRAPH_CONTAINER_ORIGINAL, TITLE_ORIGINAL, data_original_left, data_original_right);
	drawGraph(GRAPH_CONTAINER_PROCESSED, TITLE_PROCESSED, data_processed_left, data_processed_right);
}

function setGradientBackground(color, modality){
	//Set background color
	var final_color;
	if(modality == 1)
		final_color = "#FFFFFF";
	else if(modality == 2)
		final_color = "#000000";

	if(final_color) //Dynamic
		$("#gradient").css("background", "linear-gradient(to right," + color + "," + final_color + ")");
	else //Static
		$("#gradient").css("background-color", color);
}

function formatInput(item, timestamp, eye, index){
	//Prepare data to graph
	var obj = {};
    //Add item value to the first eyes data in the set
    if(index == 0){
        var marker = {};
        marker['symbol'] = MARKER_IMG;
        obj["marker"] = marker;
    }

    obj["x"] = timestamp;
    obj["y"] = eye.diameter;
    obj["name"] = item.value + " - " + timestamp;
	return obj;
}

function drawGraph(id, title, left_data, right_data){
	//Draw line chart
    $('#' + id).highcharts({
        chart:{
            type: 'spline',
            zoomType: "x"
        },
        title: {
            text: title, x: -20 //center
        },
        tooltip: {
            valueSuffix: UNIT,
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                    radius: 0,
                }
            }
        },
        xAxis: {
            title: {
                text: LABEL_X
            },
            labels: { 
                rotation: 0,
                step:1,
                staggerLines: 1,
                overflow: "justify"
            },
        },
        yAxis: {
            title: {
                text: LABEL_Y
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            allowDecimals: true
        },
        series: [{
            name: LABEL_EYE_LEFT,
            data: left_data
        }, {
            name: LABEL_EYE_RIGHT,
            data: right_data
        }]
    });
}