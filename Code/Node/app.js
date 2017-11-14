var express = require('express');
var app = express();

//testing python execution
var spawn = require("child_process").spawn;
var process = spawn('python',["../elropi.py", 1, 1]);

process.stdout.on('data', function (data){
	console.log(data.toString('utf8')); // buffer to string);
});


app.get('/', function (req, res) {
  res.send('Hello World!');

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');

});