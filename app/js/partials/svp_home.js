var scp;

$(document).ready(function(){
    scp = angular.element('.main').scope();
});

function startCalibration(){
    scp.makeRequest();
}
