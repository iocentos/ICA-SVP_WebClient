var scp;
var font_color;
var box_bgcolor;
var app_bgcolor;
var timeout = null;
var leaves_count = 0;
var cursor_window;

$(document).ready(function(){

	scp = angular.element('.main').scope();

	String.prototype.isEmpty = function() {
    	return (this.length === 0 || !this.trim());
	}

	//Set default values
	font_color = defaults.font_color;
	box_bgcolor = defaults.box_color;
	app_bgcolor = defaults.app_color;

	//Setup plugins

	$("#font_color").spectrum({
		preferredFormat: "hex",
    	showInput: true,
    	color: font_color,
    	change: setColor
	});

	$("#box_color").spectrum({
		preferredFormat: "hex",
    	showInput: true,
    	color: box_bgcolor,
    	change: setColor
	});

	$("#app_color").spectrum({
		preferredFormat: "hex",
    	showInput: true,
    	color: app_bgcolor,
    	change: setColor
	});

	//Show modal
	$('#config_modal').reveal();
});

function setColor(color){
	//Color picker callback
	if(this.id === "font_color") font_color = color;
	else if(this.id ==="box_color") box_bgcolor = color;
	else if(this.id === "app_color") app_bgcolor = color;
}

function setup(){
	//Setup environment before start
	$('body').css("background-color", app_bgcolor);
	$('#div_wrapper').css("background-color", box_bgcolor);
	$('#div_word').css("background-color", box_bgcolor);
	$('#div_word').css("color", font_color);

	//Update model
	$('#font_color').trigger('input');
	$('#box_color').trigger('input');
	$('#app_color').trigger('input');

	//Check if values are set, otherwise set default
	validate();

	//Mouse events
	$('#div_cursor').mouseleave(onMouseLeave);
	$('#div_cursor').mouseenter(onMouseEnter);
}

function closeCallback(){
	//Configuration modal close callback
	setup();
	scp.start();
}

function onMouseLeave(){
	if(timeout == null && scp.isRunning()){
		timeout = setTimeout(scp.pause, cursor_window);
	}
}

function onMouseEnter(){
	if(timeout != null){
		clearTimeout(timeout);
		timeout = null;
	}
	if(!scp.isRunning())
		scp.resume();
}

function validate(){
	//If not valid input, set defaults

	var file_name = $('#file_name').val();
	if(file_name.isEmpty()){
		$('#file_name').val(defaults.file_name);
		$('#file_name').trigger('input');
	}

	item_time = $('#item_time').val();
	if(!$.isNumeric(item_time)){
		$('#item_time').val(defaults.item_time);
		$('#item_time').trigger('input');
	}

	delay_time = $('#delay_time').val();
	if(!$.isNumeric(delay_time)){
		$('#delay_time').val(defaults.delay_time);
		$('#delay_time').trigger('input');
	}

	var font_size = $('#font_size').val();
	if($.isNumeric(font_size))
		$('#div_word').css("font-size", font_size + "pt");
	else{
		$('#div_word').css("font-size", defaults.font_size + "pt");
		$('#font_size').val(defaults.font_size);
		$('#font_size').trigger('input');
	}
	
	var cursor_padding = $('#padding').val();
	if($.isNumeric(cursor_padding))
		$('#div_cursor').css("padding", cursor_padding + "px");
	else
		$('#div_cursor').css("padding", defaults.cursor_padding + "px");

	cursor_window = $('#window').val();
	if(!$.isNumeric(cursor_window))
		cursor_window = defaults.cursor_window;
}