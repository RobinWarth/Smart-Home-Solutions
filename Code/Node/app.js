var express = require('express');
var bodyParser = require("body-parser");
var OAuthServer = require('express-oauth-server');
var memorystore = require('./model.js');
var app = express();


app.use(express.static('public'));

app.use("/styles", express.static(__dirname + '/public/css'));
app.use("/scripts", express.static(__dirname + '/public/js'));
app.use("/images", express.static(__dirname + '/public/images'));


let model = {
  state_wirelessSwitch1: 0,
  state_wirelessSwitch2: 0,
  state_wirelessSwitch3: 0,
  state_wirelessSwitch4: 0,
};


/* Webinterface */

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get('/output', function(req, res) {
  res.send(JSON.stringify(model));
});

app.post('/input', function(req, res) {
  console.log(req.body);
  //console.log(req.body);
  //testing python execution
  let id = parseInt(req.body.id, 10);
  let status = parseInt(req.body.status, 10);
  updateModel(id, status);


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

  res.send(model);

});


let callProcess = (id, status) => {
  let spawn = require("child_process").spawn;
  let process = spawn('python', ["../elropi.py", id, status]);

  process.stdout.on('data', function(data) {
    console.log(data.toString('utf8')); // buffer to string);
  });
};

let updateModel = (id, status) => {
  switch (id) {
    case 1:
      model.state_wirelessSwitch1 = status;
      break;
    case 2:
      model.state_wirelessSwitch2 = status;
      break;
    case 4:
      model.state_wirelessSwitch3 = status;
      break;
    case 8:
      model.state_wirelessSwitch4 = status;
      break;
    default:
      console.log("default: model not changed!");
      break;
  }
  console.log("updates model: " + JSON.stringify(model));
};

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');

});
