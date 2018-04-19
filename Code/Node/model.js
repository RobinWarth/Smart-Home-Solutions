let endpointInformation = {
    "endpoints": [{
            "endpointId": "wirelessSwitch1",
            "manufacturerName": "Raspberry Dude",
            "friendlyName": "Licht",
            "description": "Smart Device Switch",
            "displayCategories": ["LIGHT"],
            "cookie": {
                "key1": "This is just an example!"
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
            "friendlyName": "PC",
            "description": "Smart Device Switch",
            "displayCategories": ["SWITCH"],
            "cookie": {
                "key1": "This is just an example!"
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
            "friendlyName": "TV",
            "description": "Smart Device Switch",
            "displayCategories": ["SWITCH"],
            "cookie": {
                "key1": "This is just an example!"
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
            "endpointId": "cameraSwitch",
            "manufacturerName": "Raspberry Dude",
            "friendlyName": "Kamera",
            "description": "Smart Device Switch",
            "displayCategories": ["SWITCH"],
            "cookie": {
                "key1": "This is just an example!"
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

let data = {
    timeOfLastUpdate: "2017-09-03T16:20:50.52Z",
    devices: [{
            switchId: 1,
            endpointId: "wirelessSwitch1",
            properties: [{
                namespace: "Alexa.PowerController",
                name: "powerState",
                value: "OFF",
                timeOfSample: "2017-09-03T16:20:50.52Z", //retrieve from result.
                uncertaintyInMilliseconds: 500
            }]
        },
        {
            switchId: 2,
            endpointId: "wirelessSwitch2",
            properties: [{
                namespace: "Alexa.PowerController",
                name: "powerState",
                value: "OFF",
                timeOfSample: "2017-09-03T16:20:50.52Z", //retrieve from result.
                uncertaintyInMilliseconds: 500
            }]
        },
        {
            switchId: 4,
            endpointId: "wirelessSwitch3",
            properties: [{
                namespace: "Alexa.PowerController",
                name: "powerState",
                value: "OFF",
                timeOfSample: "2017-09-03T16:20:50.52Z", //retrieve from result.
                uncertaintyInMilliseconds: 500
            }]
        },
        {
            switchId: 8,
            endpointId: "wirelessSwitch4",
            properties: [{
                namespace: "Alexa.PowerController",
                name: "powerState",
                value: "OFF",
                timeOfSample: "2017-09-03T16:20:50.52Z", //retrieve from result.
                uncertaintyInMilliseconds: 500
            }]
        },
        {
            switchId: 0,
            endpointId: "cameraSwitch",
            properties: [{
                namespace: "Alexa.PowerController",
                name: "powerState",
                value: "OFF",
                timeOfSample: "2017-09-03T16:20:50.52Z", //retrieve from result.
                uncertaintyInMilliseconds: 500
            }]
        },
        {
            switchId: 99,
            endpointId: "wirelessSwitchAll",
            properties: [{
                namespace: "Alexa.PowerController",
                name: "powerState",
                value: "OFF",
                timeOfSample: "2017-09-03T16:20:50.52Z", //retrieve from result.
                uncertaintyInMilliseconds: 500
            }]
        }
    ]
};

exports.updateDevice = (updateDeviceAttempt) => {
    let date = new Date();
    let dateISO = date.toISOString();
    data.timeOfLastUpdate = dateISO;


    for (let device of data.devices) {
        if (device.endpointId === updateDeviceAttempt.endpointId) {
            device.properties = updateDeviceAttempt.properties;

            for (let property of device.properties) {
                property.timeOfSample = dateISO;
            }


            console.log("device updated: " + JSON.stringify(device));
            return device;
        }
    }
    console.log("device not found");
    //console.log("update data in model.js: " + JSON.stringify(data));
};

exports.getData = () => {
    return data;
};

exports.getDevice = (deviceAttempt) => {
    for (let device of data.devices) {
        if (device.endpointId === deviceAttempt.endpointId) {
            return device;
        }
    }
};

exports.setTimeOfLastUpdate = (time) => {
    data.timeOfLastUpdate = time.toISOString();
    console.log("new Time set to: " + data.timeOfLastUpdate);
};

exports.getEndpointInformation = () => {
    return endpointInformation;
};
