let RaspiCam = require('raspicam');
let fs = require('fs');

let camera = new RaspiCam({
    mode: "video",
    output: "/../../Records/"
    //framerate: 50
});

exports.switchOnOff = (value) => {

    if(value === "ON"){
        startRecording();
    }else if (value === "OFF") {
        stopRecording();
    }else{
        console.log("unknown value!");
    }
    
};

let startRecording = () => {
    console.log("camera: start recording!");
    
    let date = new Date();
    let d_string = date.toString();
    let path = "/../../../Records/";
    let output = path.concat(d_string);
    
    if(!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
    
    camera.set("output", output);
    
    camera.start();
};

let stopRecording = () => {
    console.log("camera: stop recording!");
    
    camera.stop();
};


// callbacks
camera.on("start", function( err, timestamp ){
	console.log("video started at " + timestamp );
});

camera.on("read", function( err, timestamp, filename ){
	console.log("video captured with filename: " + filename + " at " + timestamp );
});

camera.on("exit", function( timestamp ){
	console.log("video child process has exited at " + timestamp );
});

camera.on("stop", function( err, timestamp ){
	console.log("video child process was stopped at " + timestamp );
});
