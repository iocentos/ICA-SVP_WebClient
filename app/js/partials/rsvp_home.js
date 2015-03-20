var scp;

$(document).ready(function(){
    scp = angular.element('.main').scope();
    $('body').css("background-color","#FFFFFF");
});

function startCalibration(){
    scp.makeRequest();
}
