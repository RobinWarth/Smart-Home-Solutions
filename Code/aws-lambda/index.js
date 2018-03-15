const api = require('./raspberry-api.js');

exports.handler = (request, context) => {
    if (request.directive.header.namespace === 'Alexa' && request.directive.header.name === 'ReportState') {
        console.log("DEBUG:", "ReportState Request", JSON.stringify(request));
        handleReportState(request, context, "");
    }
    else if (request.directive.header.namespace === 'Alexa.Discovery' && request.directive.header.name === 'Discover') {
        console.log("DEBUG:", "Discover Request", JSON.stringify(request));
        handleDiscovery(request, context, "");
    }
    else if (request.directive.header.namespace === 'Alexa.PowerController') {
        if (request.directive.header.name === 'TurnOn' || request.directive.header.name === 'TurnOff') {
            console.log("DEBUG:", "TurnOn or TurnOff Request", JSON.stringify(request));
            handlePowerControl(request, context);
        }
    }
    else if (request.directive.header.namespace === 'Alexa.Authorization') {
        if (request.directive.header.name === 'AcceptGrant') {
            console.log("DEBUG:", "Authorization Request", JSON.stringify(request));
            handleAuthorizationAcceptGrant(request, context);
        }
    }
    else {
        console.log("DEBUG:", "Unknon Request", JSON.stringify(request));
    }
};


// SWITCH -> LIGHT?
// LIGHT bekommt durchgehend anfragen
// retievable was true
let handleDiscovery = (request, context) => {
    let payload = {
        "endpoints": [{
                "endpointId": "wirelessSwitch1",
                "manufacturerName": "Raspberry Dude",
                "friendlyName": "Licht",
                "description": "Smart Device Switch",
                "displayCategories": ["LIGHT"],
                "cookie": {
                    "key1": "arbitrary key/value pairs for skill to reference this endpoint.",
                    "key2": "There can be multiple entries",
                    "key3": "but they should only be used for reference purposes.",
                    "key4": "This is not a suitable place to maintain current endpoint state."
                },
                "capabilities": [{
                        "type": "AlexaInterface",
                        "interface": "Alexa",
                        "version": "3"
                    },
                    {
                        "interface": "Alexa.PowerController",
                        "version": "3",
                        "type": "AlexaInterface",
                        "properties": {
                            "supported": [{
                                "name": "powerState"
                            }],
                            "retrievable": true
                        }
                    }
                ]
            },
            {
                "endpointId": "wirelessSwitch2",
                "manufacturerName": "Raspberry Dude",
                "friendlyName": "PC-Switch",
                "description": "Smart Device Switch",
                "displayCategories": ["SWITCH"],
                "cookie": {
                    "key1": "arbitrary key/value pairs for skill to reference this endpoint.",
                    "key2": "There can be multiple entries",
                    "key3": "but they should only be used for reference purposes.",
                    "key4": "This is not a suitable place to maintain current endpoint state."
                },
                "capabilities": [{
                        "type": "AlexaInterface",
                        "interface": "Alexa",
                        "version": "3"
                    },
                    {
                        "interface": "Alexa.PowerController",
                        "version": "3",
                        "type": "AlexaInterface",
                        "properties": {
                            "supported": [{
                                "name": "powerState"
                            }],
                            "retrievable": true
                        }
                    }
                ]
            },
            {
                "endpointId": "wirelessSwitch3",
                "manufacturerName": "Raspberry Dude",
                "friendlyName": "TV-Switch",
                "description": "Smart Device Switch",
                "displayCategories": ["SWITCH"],
                "cookie": {
                    "key1": "arbitrary key/value pairs for skill to reference this endpoint.",
                    "key2": "There can be multiple entries",
                    "key3": "but they should only be used for reference purposes.",
                    "key4": "This is not a suitable place to maintain current endpoint state."
                },
                "capabilities": [{
                        "type": "AlexaInterface",
                        "interface": "Alexa",
                        "version": "3"
                    },
                    {
                        "interface": "Alexa.PowerController",
                        "version": "3",
                        "type": "AlexaInterface",
                        "properties": {
                            "supported": [{
                                "name": "powerState"
                            }],
                            "retrievable": true
                        }
                    }
                ]
            }
        ]
    };
    let header = request.directive.header;
    header.name = "Discover.Response";
    console.log("DEBUG", "Discovery Response: ", JSON.stringify({ header: header, payload: payload }));
    context.succeed({ event: { header: header, payload: payload } });
};



let handlePowerControl = (request, context) => {
    // get device ID passed in during discovery
    let requestMethod = request.directive.header.name;
    // get user token pass in request
    //var requestToken = request.directive.payload.scope.token;
    let powerResult = "OFF"; //default


    if (requestMethod === "TurnOn") {

        // Make the call to your device cloud for control 
        // powerResult = stubControlFunctionToYourCloud(endpointId, token, request);
        powerResult = "ON";

    }
    else if (requestMethod === "TurnOff") {
        // Make the call to your device cloud for control and check for success 
        // powerResult = stubControlFunctionToYourCloud(endpointId, token, request);
        powerResult = "OFF";

    }

    let attempt = {
        "endpointId": request.directive.endpoint.endpointId,
        "properties": [{
            "namespace": "Alexa.PowerController",
            "name": "powerState",
            "value": powerResult,
            "timeOfSample": "2017-09-03T16:20:50.52Z", //retrieve from result.
            "uncertaintyInMilliseconds": 500
        }]
    };

    //testing
    api.sendToRaspberry(attempt, request.directive.endpoint.scope.token, (error, device) => {

        let contextResponse = {
            "properties": device.properties
        };

        let eventResponse = {
            "header": {
                "messageId": request.directive.header.messageId + "-R",
                "correlationToken": request.directive.header.correlationToken,
                "namespace": "Alexa",
                "name": "Response",
                "payloadVersion": "3"
            },
            "endpoint": {
                "scope": {
                    "type": "BearerToken",
                    "token": request.directive.endpoint.scope.token //"access-token-from-skill"
                },
                "endpointId": request.directive.endpoint.endpointId,
                "cookie": {

                }
            },
            "payload": {

            }
        };



        let response = {
            context: contextResponse,
            event: eventResponse,
            payload: {}

        };



        console.log("DEBUG", "PowerController Response", JSON.stringify(response));
        context.succeed(response);
    });


}



let handleAuthorizationAcceptGrant = (request, context) => {

    /* default response if something went wrong */
    let response = {
        "event": {
            "header": {
                "messageId": request.directive.header.messageId,
                "namespace": "Alexa.Authorization",
                "name": "ErrorResponse",
                "payloadVersion": "3"
            },
            "payload": {
                "type": "ACCEPT_GRANT_FAILED",
                "message": "Failed to handle the AcceptGrant directive because ..."
            }
        }
    };


    if (request.directive.payload) {
        if (request.directive.payload.grant && request.directive.payload.grant.type === 'OAuth2.AuthorizationCode') {
            let authorizationCode = request.directive.payload.grant.code;
        }
        if (request.directive.payload.grantee && request.directive.payload.grantee.type === 'BearerToken') {
            let bearerToken = request.directive.payload.grantee.token;

            response = {
                "event": {
                    "header": {
                        "messageId": request.directive.header.messageId,
                        "namespace": "Alexa.Authorization",
                        "name": "AcceptGrant.Response",
                        "payloadVersion": "3"
                    },
                    "payload": {}
                }
            };
        }
    }
    
    console.log("DEBUG", "Authorization Response", JSON.stringify(response));
    context.succeed(response);

};


let handleReportState = (request, context) => {

    let attempt = {
        "endpointId": request.directive.endpoint.endpointId
    };

    api.statusFromRaspberry(attempt, request.directive.endpoint.scope.token, (error, device) => {


        let contextResponse = {
            "properties": device.properties
        };

        let eventResponse = {
            "header": {
                "messageId": request.directive.header.messageId + "-R",
                "correlationToken": request.directive.header.correlationToken,
                "namespace": "Alexa",
                "name": "StateReport",
                "payloadVersion": "3"
            },
            "endpoint": {
                "scope": {
                    "type": "BearerToken",
                    "token": request.directive.endpoint.scope.token //"access-token-from-skill"
                },
                "endpointId": request.directive.endpoint.endpointId,
                "cookie": {

                }
            },
            "payload": {

            }
        };



        let response = {
            context: contextResponse,
            event: eventResponse,
            payload: {}

        };
        console.log("DEBUG", "ReportState Response", JSON.stringify(response));
        context.succeed(response);
    });




};
