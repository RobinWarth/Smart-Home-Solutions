let RaspiCam = require('raspicam');
let fs = require('fs');

let camera = new RaspiCam({
    mode: "video",
    output: "/Records/",
    timeout: 3600000
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
    
    // Dateinamen aus Datum und Uhrzeit erzeugen
    let d = new Date();
    let time_string = d.toTimeString();
    let time = time_string.split(' ')[0].replace(/:/g , "-");
    
    let date = d.toString();
    let dates = date.split(' ');
    let date_string = dates[2].concat(dates[1].concat(dates[3]));
    
    let full_date = date_string.concat("_".concat(time)); 
    
    // Output-Directory: Anlegen, falls nicht schon vorhanden
    let new_dir = "/../../../Records/";
    let path = process.cwd().concat(new_dir);
    
    console.log(path)
    if(!fs.existsSync(path)){
        console.log("to create")
        fs.mkdirSync(path);
    }
    
    let output = path.concat(full_date, ".h264");
    
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
