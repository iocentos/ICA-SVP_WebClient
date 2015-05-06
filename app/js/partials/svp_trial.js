
var TITLE_ORIGINAL = "Sampled data after data cleaning";
var SUBTITLE_ORIGINAL = "Blinks and outliers removed";
var TITLE_PROCESSED = "Processed data";
var SUBTITLE_PROCESSED = "Scaled and denoised";
var UNIT = "mm";
var LABEL_X = "Time(ms)";
var LABEL_Y_ORIGINAL = "Dilation(mm)";
var LABEL_Y_PROCESSED = "Dilation(mm) - Baseline pupil size";
var LABEL_EYE_LEFT = "Left eye";
var LABEL_EYE_RIGHT = "Right eye";
var LABEL_DELAY = "DELAY";
var GRAPH_CONTAINER_ORIGINAL = "original";
var GRAPH_CONTAINER_PROCESSED = "processed";
var PARAM_EYES = "eyes";
var PARAM_VALUE = "value";
var MARKER_IMG_RED = "url(" + defaults.marker_url_red + ")";
var MARKER_IMG_BLUE = "url(" + defaults.marker_url_blue + ")";
var Y_AXIS_RATIO_ORIGINAL = 6;
var Y_AXIS_RATIO_PROCESSED = 2;

var scp;
var chart1;
var chart2;

$(document).ready(function(){

		$('body').css("background-color","#FFFFFF");

		//original graph	
		$("#original_y").val(Y_AXIS_RATIO_ORIGINAL);
		$("#original_y").change(onYaxisChange);
		//processed graph
		$("#processed_y").val(Y_AXIS_RATIO_PROCESSED);
		$("#processed_y").change(onYaxisChange);

		setTimeout(function(){ 
			scp = angular.element('.main').scope(); 
			Graph(scp.trial);
			setGradientBackground(scp.trial.configuration.app_bg , scp.trial.configuration.bg_modality);
		}, 500);


		var myPlotLineId = "myPlotLine";
		var controllingChart;

		var defaultTickInterval = 5;
		var currentTickInterval = defaultTickInterval; 
});

function onYaxisChange(){

	//Update y-axis limits when the input text changes
	var value = $(this).val();

	if(this.id === "original_y"){
		chart1.yAxis[0].update({
            max: value
    	});
	}else{
		chart2.yAxis[0].update({
            max: value,
            min: -value
    	});
	}
}

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
	drawGraph(GRAPH_CONTAINER_ORIGINAL, TITLE_ORIGINAL, SUBTITLE_ORIGINAL, data_original_left, data_original_right);
	drawGraph(GRAPH_CONTAINER_PROCESSED, TITLE_PROCESSED, SUBTITLE_PROCESSED, data_processed_left, data_processed_right);
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

		if(item.value != LABEL_DELAY)
			marker['symbol'] = MARKER_IMG_RED;
		else
			marker['symbol'] = MARKER_IMG_BLUE;

		obj["marker"] = marker;
	}

	obj["x"] = timestamp;
	obj["y"] = eye.diameter;
	obj["name"] = item.value + " - " + timestamp;
	return obj;
}


//Graphs functionality

function drawGraph(id, title, subtitle, left_data, right_data){

	if( id === GRAPH_CONTAINER_ORIGINAL ){

		var chart1Events = {

				afterSetExtremes:function(){

					if (!this.chart.options.chart.isZoomed)
					{                                         
						var xMin = this.chart.xAxis[0].min;
						var xMax = this.chart.xAxis[0].max;

						var zmRange = computeTickInterval(xMin, xMax);
						chart1.xAxis[0].options.tickInterval =zmRange;
						chart1.xAxis[0].isDirty = true;
						chart2.xAxis[0].options.tickInterval = zmRange;
						chart2.xAxis[0].isDirty = true;

						chart2.options.chart.isZoomed = true;

						chart2.xAxis[0].setExtremes(xMin, xMax, true);
						chart2.options.chart.isZoomed = false;

					}
				}
			};

		chart1 = setUpGraphToDraw(GRAPH_CONTAINER_ORIGINAL, title, subtitle, left_data,right_data , 
			chart1Events, Y_AXIS_RATIO_ORIGINAL, 0, LABEL_Y_ORIGINAL);
	}
	else if(id === GRAPH_CONTAINER_PROCESSED ){

		var chart2Events = {
				afterSetExtremes: function() {
					if (!this.chart.options.chart.isZoomed) 
					{
						var xMin = this.chart.xAxis[0].min;
						var xMax = this.chart.xAxis[0].max;
						var zmRange = computeTickInterval(xMin, xMax);
						chart1.xAxis[0].options.tickInterval =zmRange;
						chart1.xAxis[0].isDirty = true;
						chart2.xAxis[0].options.tickInterval = zmRange;
						chart2.xAxis[0].isDirty = true;

						chart1.options.chart.isZoomed = true;
						chart1.xAxis[0].setExtremes(xMin, xMax, true);
						chart1.options.chart.isZoomed = false;                                
					}
				}
			};

		chart2 = setUpGraphToDraw(GRAPH_CONTAINER_PROCESSED, title, subtitle, left_data,right_data , 
			chart2Events , Y_AXIS_RATIO_PROCESSED, -Y_AXIS_RATIO_PROCESSED, LABEL_Y_PROCESSED);
	}

}

function setUpGraphToDraw(containerId, title, subtitle, left_data , right_data, events, yAxis_max, yAxis_min, yAxis_label){
	var chart = new Highcharts.Chart({
		chart:{
			renderTo: containerId,
			type: 'spline',
			zoomType: "x"
		},
		title: {
		text: title
		},
		subtitle: {
            text: subtitle
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
				},
				turboThreshold:100000
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
			events:events
		},
		yAxis: {
			title: {
				text: yAxis_label
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}],
			allowDecimals: true,
			min: yAxis_min,
			max: yAxis_max
		},
		series: [{
				name: LABEL_EYE_LEFT,
				data: left_data
			}, {
				name: LABEL_EYE_RIGHT,
				data: right_data
			}],
			pointInterval:200

			}, function(chart) { //add this function to the chart definition to get synchronized crosshairs
				syncronizeCrossHairs(chart);

	});


	return chart;
}

function syncronizeCrossHairs(chart) {
	var container = $(chart.container),
	offset = container.offset(),
	x, y, isInside, report;

	container.mousemove(function(evt) {

		x = evt.clientX - chart.plotLeft - offset.left;
		y = evt.clientY - chart.plotTop - offset.top;
		var xAxis = chart.xAxis[0];
			//remove old plot line and draw new plot line (crosshair) for this chart
			var xAxis1 = chart1.xAxis[0];
			xAxis1.removePlotLine("myPlotLineId");
			xAxis1.addPlotLine({
				value: chart.xAxis[0].translate(x, true),
				width: 1,
				color: 'red',
			//dashStyle: 'dash',                   
			id: "myPlotLineId"
			});
						//remove old crosshair and draw new crosshair on chart2
						var xAxis2 = chart2.xAxis[0];
						xAxis2.removePlotLine("myPlotLineId");
						xAxis2.addPlotLine({
							value: chart.xAxis[0].translate(x, true),
							width: 1,
							color: 'red',
			//dashStyle: 'dash',                   
			id: "myPlotLineId"
			});

			//if you have other charts that need to be syncronized - update their crosshair (plot line) in the same way in this function.                   
	});
}

//compute a reasonable tick interval given the zoom range -
//have to compute this since we set the tickIntervals in order
//to get predictable synchronization between 3 charts with
//different data.
function computeTickInterval(xMin, xMax) {
	var zoomRange = xMax - xMin;

	if (zoomRange <= 2)
		currentTickInterval = 0.5;
	if (zoomRange < 20)
		currentTickInterval = 1;
	else if (zoomRange < 100)
		currentTickInterval = 5;
}

//explicitly set the tickInterval for the 3 charts - based on
//selected range
function setTickInterval(event) {
	var xMin = event.xAxis[0].min;
	var xMax = event.xAxis[0].max;
	computeTickInterval(xMin, xMax);

	chart1.xAxis[0].options.tickInterval = currentTickInterval;
	chart1.xAxis[0].isDirty = true;
	chart2.xAxis[0].options.tickInterval = currentTickInterval;
	chart2.xAxis[0].isDirty = true;

}

//reset the extremes and the tickInterval to default values
function unzoom() {
	chart1.xAxis[0].options.tickInterval = defaultTickInterval;
	chart1.xAxis[0].isDirty = true;
	chart2.xAxis[0].options.tickInterval = defaultTickInterval;
	chart2.xAxis[0].isDirty = true;

	chart1.xAxis[0].setExtremes(null, null);
	chart2.xAxis[0].setExtremes(null, null);
}

$('#zoom_button').click(function(){
	unzoom();
});
