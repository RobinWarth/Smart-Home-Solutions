const api = require('./raspberry-api.js');

exports.handler = function(request, context) {
    if (request.directive.header.namespace === 'Alexa' && request.directive.header.name === 'ReportState') {
        log("DEBUG:", "ReportState Request", JSON.stringify(request));
        handleReportState(request, context, "");
    }
    else if (request.directive.header.namespace === 'Alexa.Discovery' && request.directive.header.name === 'Discover') {
        log("DEBUG:", "Discover Request", JSON.stringify(request));
        handleDiscovery(request, context, "");
    }
    else if (request.directive.header.namespace === 'Alexa.PowerController') {
        if (request.directive.header.name === 'TurnOn' || request.directive.header.name === 'TurnOff') {
            log("DEBUG:", "TurnOn or TurnOff Request", JSON.stringify(request));
            handlePowerControl(request, context);
        }
    }
    else if (request.directive.header.namespace === 'Alexa.Authorization') {
        if (request.directive.header.name === 'AcceptGrant') {
            log("DEBUG:", "Authorization Request", JSON.stringify(request));
            handleAuthorizationAcceptGrant(request, context);
        }
    }
    else {
        log("DEBUG:", "Unknon Request", JSON.stringify(request));
    }

    // SWITCH -> LIGHT?
    // LIGHT bekommt durchgehend anfragen
    // retievable was true
    function handleDiscovery(request, context) {
        var payload = {
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
        var header = request.directive.header;
        header.name = "Discover.Response";
        log("DEBUG", "Discovery Response: ", JSON.stringify({ header: header, payload: payload }));
        context.succeed({ event: { header: header, payload: payload } });
    }

    function log(message, message1, message2) {
        console.log(message + message1 + message2);
    }




    function handlePowerControl(request, context) {
        // get device ID passed in during discovery
        var requestMethod = request.directive.header.name;
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
        api.sendToRaspberry(attempt, context, (error, context, device) => {

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



            log("DEBUG", "PowerController Response", JSON.stringify(response));
            context.succeed(response);
        });


    }



    function handleAuthorizationAcceptGrant(request, context) {
        if (request.payload) {
            if (request.payload.grant && request.payload.grant.type === 'OAuth2.AuthorizationCode') {
                let authorizationCode = request.payload.grant.code;
            }
            if (request.payload.grantee && request.payload.grantee.type === 'BearerToken') {
                let bearerToken = request.payload.grantee.token;
            }
        }


    }


    function handleReportState(request, context) {

        let attempt = {
            "endpointId": request.directive.endpoint.endpointId
        };

        api.statusFromRaspberry(attempt, context, (error, context, device) => {


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
            log("DEBUG", "ReportState Response", JSON.stringify(response));
            context.succeed(response);
        });




    }

};
