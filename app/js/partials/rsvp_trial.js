var scp;

$(document).ready(function(){
    setTimeout(function(){ 
        scp = angular.element('.main').scope(); 
        Graph(scp.trial);
    }, 500);
});

//Graph data
function Graph(trial){

    var img_url = "url(" + defaults.marker_url + ")";

    var left_data = [];
    var right_data = [];

    $.each(trial.data, function( index, value ){
        
        var item = value.item;

        //If null, set delay as value
        if(item.value == null){
            item["value"] = "Delay";
            console.log (item.value);
        }

        //Add Eye data from current item
        $.each($(value.eyes), function( index, eyes ){
            
            var left_eye = eyes.left_eye;
            var right_eye = eyes.right_eye;    

            //Add item value to the first eyes data in the set
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

    //Show line chart
    $('#container').highcharts({
        chart:{
            type: 'spline',
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
}