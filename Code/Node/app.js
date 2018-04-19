const model = require("./model.js");
const wirelessTransmitter = require("./wireless-transmitter.js");
const camConnector = require("./cam-connector.js");
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");
const httpProxy = require('http-proxy');

const app = express();
var proxy = httpProxy.createProxyServer({});


app.use(express.static('public'));

app.use("/node_modules", express.static(__dirname + '/node_modules'));
app.use("/styles", express.static(__dirname + '/public/css'));
app.use("/scripts", express.static(__dirname + '/public/js'));
app.use("/images", express.static(__dirname + '/public/images'));





/* Webinterface */

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/live-cam.mjpg', function(req, res) {
  console.log("live-cam: request");
  proxy.web(req, res, { target: 'http://127.0.0.1:8090' });
});


app.get('/record-files', function(req, res) {
  fs.readdir(path.resolve(__dirname.concat('../../../../Records/')), function(err, files) {
    if (err) {
      console.log(err);
    }
    else {
      let mp4Files = filterMp4FilesFromStringArray(files).reverse();
      res.send(mp4Files);
      console.log("GET /record-files: ".concat(mp4Files));
    }

  });
});

app.get('/record-files/:id', function(req, res) {
  res.sendFile(path.resolve(__dirname.concat('../../../../Records/', req.params.id)));
});




app.get('/discovery', function(req, res) {
  let endpointInformation = JSON.stringify(model.getEndpointInformation());
  console.log(`DISCOVERY-Request`, endpointInformation);
  res.send(endpointInformation);
});

app.post('/report-state', function(req, res) {
  let deviceAttempt = req.body;
  let device = model.getDevice(deviceAttempt);

  console.log(JSON.stringify(device));
  res.send(JSON.stringify(device));
});

app.post('/power-controller', function(req, res) {

  updateDevice(req.body, (updatedDevice, id, status) => {
    res.send(JSON.stringify(updatedDevice));

    if (id != 99) { /* not "All" */
      toWirelessTransmitter(id, status);
    }
    else {
      id = 1;
      let interval = setInterval(() => {
        toWirelessTransmitter(id, status);
        id *= 2;
        if (id === 8) {
          clearInterval(interval);
        }

      }, 1000);
    }



  });

});

app.post('/cam-controller', function(req, res) {

  updateDevice(req.body, (updatedDevice, id, status) => {
    res.send(JSON.stringify(updatedDevice));

    camConnector.switchOnOff(status);
  });

});


let updateDevice = (data, callback) => {

  let deviceUpdateAttempt = data;
  console.log(JSON.stringify(deviceUpdateAttempt));


  let updatedDevice = model.updateDevice(deviceUpdateAttempt);
  let id = updatedDevice.switchId;

  let status = 0;
  for (let property of updatedDevice.properties) {
    if (property.namespace === "Alexa.PowerController" && property.name === "powerState") {
      status = property.value;
    }
  }


  callback(updatedDevice, id, status);
};


let toWirelessTransmitter = (id, status) => {

  let timeOfLastProcess = new Date(model.getData().timeOfLastUpdate);
  let timeNow = new Date();
  let delta = 500;

  //console.log("timeNow: " + timeNow, "timeOfLastProcess: " + timeOfLastProcess, "timeOfLastProcess + delta - timeNow: " + (timeOfLastProcess.getTime() + delta - timeNow.getTime()));
  if (timeOfLastProcess.getTime() + delta > timeNow.getTime()) {
    setTimeout(() => { toWirelessTransmitter(id, status) }, 100);
  }
  else {
    callProcess(id, status);
  }

};

let callProcess = (id, status) => {

  model.setTimeOfLastUpdate(new Date());
  wirelessTransmitter.transmitToWirelessSwitch(id, status, "01110"); //TODD: change to webinterface input!

};

let filterMp4FilesFromStringArray = (fileArray) => {
  let mp4Files = [];
  for (let file of fileArray) {
    if (file.includes(".mp4", file.length - 4)) {
      mp4Files.push(file);
    }
  }
  return mp4Files;
};







app.listen(3000, function() {
  console.log('Example app listening on port 3000!');

});
