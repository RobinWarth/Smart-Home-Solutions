// move to model.js or model.json
let data = {
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
        }
    ]
};

exports.updateDevice = (updateDeviceAttempt) => {
    for (let device of data.devices) {
        if (device.endpointId === updateDeviceAttempt.endpointId) {
            device.properties = updateDeviceAttempt.properties;
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

