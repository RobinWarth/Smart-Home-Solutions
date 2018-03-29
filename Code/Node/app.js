const model = require("./model.js")
const wirelessTransmitter = require("./wireless-transmitter.js")
const express = require('express');
const bodyParser = require("body-parser");

const app = express();


app.use(express.static('public'));

app.use("/styles", express.static(__dirname + '/public/css'));
app.use("/scripts", express.static(__dirname + '/public/js'));
app.use("/images", express.static(__dirname + '/public/images'));





/* Webinterface */

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
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

  console.log(`type: ${typeof(req.body)}`, `JSON.stringify: ${JSON.stringify(req.body)}`);
  let deviceUpdateAttempt = req.body;
  console.log(JSON.stringify(deviceUpdateAttempt));
  //console.log(req.body);
  //testing python execution
  //let id = parseInt(req.body.id, 10);
  //let status = parseInt(req.body.status, 10);
  let updatedDevice = model.updateDevice(deviceUpdateAttempt);
  let id = updatedDevice.switchId;

  let status = 0;
  for (let property of updatedDevice.properties) {
    if (property.namespace === "Alexa.PowerController" && property.name === "powerState") {

      /* ternary operator */
      //status = property.value === "ON" ? 1 : 0;
      status = property.value;
    }
  }


  if (id != 99) { /* not "All" */
    toPythonScript(id, status);
  }
  else {
    id = 1;
    let interval = setInterval(() => {
      toPythonScript(id, status);
      id *= 2;
      if (id === 8) {
        clearInterval(interval);
      }

    }, 1000);
  }

  res.send(JSON.stringify(updatedDevice));

});







let toPythonScript = (id, status) => {

  let timeOfLastProcess = new Date(model.getData().timeOfLastUpdate);
  let timeNow = new Date();
  let delta = 500;

  //console.log("timeNow: " + timeNow, "timeOfLastProcess: " + timeOfLastProcess, "timeOfLastProcess + delta - timeNow: " + (timeOfLastProcess.getTime() + delta - timeNow.getTime()));
  if (timeOfLastProcess.getTime() + delta > timeNow.getTime()) {
    setTimeout(() => { toPythonScript(id, status) }, 100);
  }
  else {
    callProcess(id, status);
  }


};

let callProcess = (id, status) => {

  /*
  model.setTimeOfLastUpdate(new Date());
  let spawn = require("child_process").spawn;
  let process = spawn('python', ["../elropi.py", id, status]);


  process.stdout.on('data', function(data) {
    console.log(data.toString('utf8')); // buffer to string);
  });
  */

  model.setTimeOfLastUpdate(new Date());
  wirelessTransmitter.transmitToWirelessSwitch(id, status, "01110"); //TODD: change to webinterface input!


}


app.listen(3000, function() {
  console.log('Example app listening on port 3000!');

});
