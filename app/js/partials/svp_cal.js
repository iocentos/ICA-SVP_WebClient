var scp;
var cal_color;

$(document).ready(function(){

	scp = angular.element('.main').scope();
	
	$("#div_point").toggle();

	//Set default values
	cal_color = defaults.cal_color;

	//Setup plugins
	$("#cal_color").spectrum({
		preferredFormat: "hex",
    	showInput: true,
    	color: cal_color,
    	change: setColor,
    	showButtons: false
	});

	//Show modal
	$('.reveal-modal').css('max-height', $('html').height() - 110 + 'px');
	$('#config_modal').reveal();
});

// Reset max-height after window resize
$(window).resize(function() {
    $('.reveal-modal').css('max-height', $('html').height() - 110 + 'px');
});

function setColor(color){
	//Color picker callback
	if(this.id === "cal_color") cal_color = color;
}

function setup(){
	//Setup environment before start
	$('body').css("background-color", cal_color);
	//Update model
	$('#cal_color').trigger('input');
	//Animate description and target
	setTimeout(function() {
      	$("#div_text" ).fadeOut( "slow", function() {
    		$( "#div_point" ).fadeIn( "slow", startCalibration);
  		});
	}, 2000);
}

function closeCallback(){
	//Configuration modal close callback
	$(".main").css("cursor","none");
	setup();
}

function calibrationFinished(){
	$(".main").css("cursor","pointer");
	$("#text").html("Calibration completed");

	$( "#div_point" ).fadeOut( "slow", function(){
		$("#div_text" ).fadeIn( "slow", function() {
			setTimeout(function() {
      			window.history.back();
			}, 2500);
	  	});
	});
}

function startCalibration(){
    scp.makeRequest();
}
