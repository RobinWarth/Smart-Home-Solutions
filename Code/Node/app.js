const model = require("./model.js")
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

app.post('/output', function(req, res) {
  let deviceAttempt = req.body;
  res.send(JSON.stringify(model.getDevice(deviceAttempt)));
});

app.post('/input', function(req, res) {
  console.log(`body: ${req.body}`, `type: ${typeof(req.body)}`, `JSON.stringify: ${JSON.stringify(req.body)}`);
  let deviceUpdateAttempt = req.body;
  console.log(deviceUpdateAttempt);
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
      status = property.value === "ON" ? 1 : 0;
    }
  }


  if (id != 99) { /* not "All" */
    callProcess(id, status);
  }
  else {
    id = 1;
    let interval = setInterval(() => {
      callProcess(id, status);
      id *= 2;
      if (id === 8) {
        clearInterval(interval);
      }

    }, 1000);
  }
  console.log("send");
  res.send(JSON.stringify(updatedDevice));

});







let callProcess = (id, status) => {
  let spawn = require("child_process").spawn;
  let process = spawn('python', ["../elropi.py", id, status]);

  process.stdout.on('data', function(data) {
    console.log(data.toString('utf8')); // buffer to string);
  });
};


app.listen(3000, function() {
  console.log('Example app listening on port 3000!');

});
