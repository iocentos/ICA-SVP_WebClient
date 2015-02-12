$(document).ready(function(){

		var img_url = "url(" + defaults.marker_url + ")";

		//TODO Fake data
		var trial = {"configuration":{"trial":"trial 0","user_name":"name","user_age":"age","file_name":"file_name","item_time":"item_time","delay_time":"delay_time","font_size":"font_size","font_color":"font_color","box_bg":"box_bg","app_bg":"app_bg","save_log":true},"data":[{"item":{"timestamp":346,"duration":1000,"value":null},"eyes":[{"timestamp":346,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":1287,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":1346,"duration":1000,"value":"test"},"eyes":[{"timestamp":1930,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":2346,"duration":941,"value":null},"eyes":[{"timestamp":2582,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":2621,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":2679,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":3287,"duration":1000,"value":"test"},"eyes":[{"timestamp":3497,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":4121,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":4262,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":4930,"duration":1000,"value":"test"},"eyes":[{"timestamp":4983,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":5301,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":5930,"duration":652,"value":null},"eyes":[{"timestamp":6239,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":6582,"duration":1000,"value":"test"},"eyes":[{"timestamp":7085,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":7113,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":7192,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":7532,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":7620,"duration":1000,"value":"test"},"eyes":[{"timestamp":8046,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":8677,"duration":1000,"value":"test"},"eyes":[{"timestamp":9030,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":9553,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":9677,"duration":818,"value":null},"eyes":[{"timestamp":10352,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":10495,"duration":1000,"value":"test"},"eyes":[{"timestamp":11059,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":11495,"duration":624,"value":null},"eyes":[{"timestamp":11631,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":12119,"duration":1000,"value":"test"},"eyes":[{"timestamp":12400,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":12879,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":13259,"duration":1000,"value":"test"},"eyes":[{"timestamp":13457,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":14116,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":14259,"duration":720,"value":null},"eyes":[{"timestamp":14788,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":14979,"duration":1000,"value":"test"},"eyes":[{"timestamp":15552,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":15978,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":16297,"duration":1000,"value":"test"},"eyes":[{"timestamp":16875,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":17297,"duration":938,"value":null},"eyes":[{"timestamp":17850,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":18235,"duration":1000,"value":"test"},"eyes":[{"timestamp":18397,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":18824,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}},{"timestamp":19087,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]},{"item":{"timestamp":19235,"duration":846,"value":null},"eyes":[{"timestamp":19636,"left_eye":{"diameter":5.0},"right_eye":{"diameter":5.0}}]}]};

		var left_data = [];
		var right_data = [];

        $.each(trial.data, function( index, value ){
    		
    		var item = value.item;

    		if(item.value == null){
    			item["value"] = "Delay";
    			console.log (item.value);
    		}

			$.each($(value.eyes), function( index, eyes ){
				
				var left_eye = eyes.left_eye;
				var right_eye = eyes.right_eye;    

				if(index == 0){
					var marker = {};
					marker['symbol'] = img_url;
					//Left eye
					var obj = {};
					obj["x"] = eyes.timestamp;
					obj["y"] = left_eye.diameter;
					obj["name"] = item.value;
					obj["marker"] = marker;
					left_data.push(obj);
					
					//Right eye
					var obj = {};
					obj["x"] = eyes.timestamp;
					obj["y"] = right_eye.diameter;
					obj["name"] = item.value;
					obj["marker"] = marker;
					right_data.push(obj);

				}else{
					//Left eye
					var xy = [];
					xy[0] = eyes.timestamp;
					xy[1] = left_eye.diameter;
					left_data.push(xy);
					//Right eye
					var xy = [];
					xy[0] = eyes.timestamp;
					xy[1] = right_eye.diameter;
					right_data.push(xy);
				}
			});
		});

       
      $('#container').highcharts({
        chart:{
            zoomType: "x"
        },
        title: {
            text: trial.configuration.trial, x: -20 //center
        },
        tooltip: {
            valueSuffix: 'mm',
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
                text: 'Time(ms)'
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
                text: 'Dilation(mm)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            allowDecimals: true
        },
        series: [{
            name: 'Left eye',
            data: left_data
        }, {
            name: 'Right eye',
            data: right_data
        }]
    });
});