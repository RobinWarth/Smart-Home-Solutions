const RaspiCam = require('raspicam');
const fs = require('fs');
const { spawn } = require('child_process');

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
    
    console.log(path);
    if(!fs.existsSync(path)){
        console.log("to create");
        fs.mkdirSync(path);
    }
    
    let output = path.concat(full_date, ".h264");
    
    camera.set("output", output);
    
    camera.start();
};

let stopRecording = () => {
    console.log("camera: stop recording!");
    console.log("my output is: " + camera.get("output"));
    
    camera.stop();
};


/* convert .h264 into .mp4 */
let convertLastVideoToMp4 = () => {
    let outputH264 = camera.get("output");
    let outputMp4 = outputH264.slice(0, outputH264.indexOf("h264")) + "mp4";
    
    const ls = spawn('ffmpeg', ['-framerate', '50', '-i', outputH264, '-c', 'copy', outputMp4]);
    

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    
    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    
    //exec("ffmpeg -framerate 24 -i " + outputH264 + " -c copy " + outputMp4);
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
	convertLastVideoToMp4();
});

camera.on("stop", function( err, timestamp ){
	console.log("video child process was stopped at " + timestamp );
});
