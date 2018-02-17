function postRaspberry(endpointId, status) {
    var url = window.location.href;
    var fullUrl = url + "input";

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


    jQuery.ajax({
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


jQuery("#buttonAon").click(function() {
    postRaspberry("wirelessSwitch1", "ON");
});

jQuery("#buttonAoff").click(function() {
    postRaspberry("wirelessSwitch1", "OFF");
});

jQuery("#buttonBon").click(function() {
    postRaspberry("wirelessSwitch2", "ON");
});

jQuery("#buttonBoff").click(function() {
    postRaspberry("wirelessSwitch2", "OFF");
});

jQuery("#buttonCon").click(function() {
    postRaspberry("wirelessSwitch3", "ON");
});

jQuery("#buttonCoff").click(function() {
    postRaspberry("wirelessSwitch3", "OFF");
});

jQuery("#buttonDon").click(function() {
    postRaspberry("wirelessSwitch4", "ON");
});

jQuery("#buttonDoff").click(function() {
    postRaspberry("wirelessSwitch4", "OFF");
});

jQuery("#buttonAllon").click(function() {
    postRaspberry("wirelessSwitch1", "ON"); //change
});

jQuery("#buttonAlloff").click(function() {
    postRaspberry("wirelessSwitch1", "OFF"); //change
});
