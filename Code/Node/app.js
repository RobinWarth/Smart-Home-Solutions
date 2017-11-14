var express = require('express');
var app = express();

app.use(express.static('public'));

app.use("/styles",  express.static(__dirname + '/public/css'));
app.use("/scripts", express.static(__dirname + '/public/js'));
app.use("/images",  express.static(__dirname + '/public/images'));


//testing python execution
var spawn = require("child_process").spawn;
var process = spawn('python',["../elropi.py", 1, 1]);

process.stdout.on('data', function (data){
	console.log(data.toString('utf8')); // buffer to string);
});


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');

});