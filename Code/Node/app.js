var express = require('express');
var bodyParser = require("body-parser");
var OAuthServer = require('express-oauth-server');
var memorystore = require('model.js');
var app = express();


app.use(express.static('public'));

app.use("/styles",  express.static(__dirname + '/public/css'));
app.use("/scripts", express.static(__dirname + '/public/js'));
app.use("/images",  express.static(__dirname + '/public/images'));

/*
//testing python execution
var spawn = require("child_process").spawn;
var process = spawn('python',["../elropi.py", 1, 1]);


process.stdout.on('data', function (data){
	console.log(data.toString('utf8')); // buffer to string);
});

*/



/* OAuth2 */

app.oauth = new OAuthServer({
  model: memorystore, // See https://github.com/oauthjs/node-oauth2-server for specification 
});
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(app.oauth.authorize());
 
app.use(function(req, res) {
  res.send('Secret area');
});

app.get('/oauth', function (req, res) {
  res.sendfile(__dirname + '/public/oauth.html');
});


/* Webinterface */

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});



app.post('/input', urlencodedParser, function (req, res) {
console.log(req.body);
  //testing python execution
  var id = req.body.id;
  var status = req.body.status;
  
  var spawn = require("child_process").spawn;
  var process = spawn('python',["../elropi.py", id, status]);
  
  process.stdout.on('data', function (data){
	console.log(data.toString('utf8')); // buffer to string);
  });

  res.send("Alright!")

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');

});