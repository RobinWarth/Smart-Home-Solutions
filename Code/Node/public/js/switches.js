/* global $ */

function postRaspberry(endpointId, status) {
    let url = window.location.hostname;
    if(window.location.port){
        url += ":" + window.location.port;
    }
    let fullUrl = window.location.protocol.concat("//", url, "/power-controller");

    let attempt = {
        endpointId: endpointId,
        properties: [{
            namespace: "Alexa.PowerController",
            name: "powerState",
            value: status,
            timeOfSample: "2017-09-03T16:20:50.52Z", //retrieve from result.
            uncertaintyInMilliseconds: 500
        }]
    };
    let attemptString = JSON.stringify(attempt);
    console.log(attemptString);


    $.ajax({
        type: "POST",
        url: fullUrl,
        data: attemptString,
        success: callbackSuccess,
        dataType: "json",
        contentType: 'application/json'
    });
}

function callbackSuccess(data, status) {
    console.log("Data: " + data + "\nStatus: " + status);
}


$("#buttonAon").click(function() {
    postRaspberry("wirelessSwitch1", "ON");
});

$("#buttonAoff").click(function() {
    postRaspberry("wirelessSwitch1", "OFF");
});

$("#buttonBon").click(function() {
    postRaspberry("wirelessSwitch2", "ON");
});

$("#buttonBoff").click(function() {
    postRaspberry("wirelessSwitch2", "OFF");
});

$("#buttonCon").click(function() {
    postRaspberry("wirelessSwitch3", "ON");
});

$("#buttonCoff").click(function() {
    postRaspberry("wirelessSwitch3", "OFF");
});

$("#buttonDon").click(function() {
    postRaspberry("wirelessSwitch4", "ON");
});

$("#buttonDoff").click(function() {
    postRaspberry("wirelessSwitch4", "OFF");
});




$("#buttonAllon").click(function() {
    postRaspberry("wirelessSwitchAll", "ON");
});

$("#buttonAlloff").click(function() {
    postRaspberry("wirelessSwitchAll", "OFF");
});