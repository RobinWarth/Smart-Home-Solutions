// move to model.js or model.json
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
            
            for (let property of device.properties){
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
}
