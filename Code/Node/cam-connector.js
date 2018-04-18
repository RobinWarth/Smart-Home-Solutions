const RaspiCam = require('raspicam');
const fs = require('fs');
const { spawn } = require('child_process');

let myCam = new CamController();

exports.switchOnOff = (value) => {

    if (value === "ON") {
        myCam.startRecording();
    }
    else if (value === "OFF") {
        myCam.stopRecording();
    }
    else {
        console.log("unknown value!");
    }

};

let killFFServerProcess = (callback) => {

    let killignProcess = spawn('pkill', ['-f', 'ffserver']);


    killignProcess.stdout.on('data', (data) => {
        console.log(`killignProcess - stdout: ${data}`);
    });

    killignProcess.stderr.on('data', (data) => {
        console.log(`killignProcess - stderr: ${data}`);
    });

    killignProcess.on('close', (code) => {
        console.log(`killignProcess - child process exited with code ${code}`);
        callback();
    });

};

let startFFserverProcess = () => {
    let startingProcess = spawn('../../Install-Scripts/reconfigure_ffmpeg');


    startingProcess.on('close', (code) => {
        console.log(`startingProcess - child process exited with code ${code}`);
    });
};


class CamController {

    constructor() {

        console.log("new Cam instance...");

    }

    startRecording() {
        if (this.camera) {
            this.setStopListener(() => {
                this.createNewCam();
            })
            this.camera.stop();
        } else {
            this.createNewCam();
        }
    }

    createNewCam() {

        this.camera = new RaspiCam({
            mode: "video",
            output: "/Records/",
            timeout: 3600000
            //framerate: 50
        });

        let d = new Date();
        let time_string = d.toTimeString();
        let time = time_string.split(' ')[0].replace(/:/g, "-");

        let date = d.toString();
        let dates = date.split(' ');
        let date_string = dates[2].concat(dates[1].concat(dates[3]));

        let full_date = date_string.concat("_".concat(time));

        // Output-Directory: Anlegen, falls nicht schon vorhanden
        let new_dir = "/../../../Records/";
        let path = process.cwd().concat(new_dir);

        console.log(path);
        if (!fs.existsSync(path)) {
            console.log("to create");
            fs.mkdirSync(path);
        }

        let output = path.concat(full_date, ".h264");

        this.camera.set("output", output);

        killFFServerProcess(() => {
            this.camera.start();

            // callbacks
            this.setAllListeners();
        });
    }

    stopRecording() {
        console.log("camera: stop recording!");
        console.log("my output is: " + camera.get("output"));

        if (this.camera) {
            this.camera.stop();
        }

    }

    setAllListeners() {
        this.setStartListener();
        this.setReadListener();
        this.setExitListener();
        this.setStopListener();
    }

    setStartListener() {
        this.camera.on("start", (err, timestamp) => {
            console.log("video started at " + timestamp);
        });
    }

    setReadListener() {
        this.camera.on("read", (err, timestamp, filename) => {
            console.log("video captured with filename: " + filename + " at " + timestamp);
        });
    }

    setExitListener() {
        this.camera.on("exit", (timestamp) => {
            console.log("video child process has exited at " + timestamp);
            this.convertLastVideoToMp4();
        });
    }

    setStopListener(callback) {
        camera.on("stop", (err, timestamp) => {
            console.log("video child process was stopped at " + timestamp);
            startFFserverProcess();

            callback();
        });
    }


    /* convert .h264 into .mp4 */
    convertLastVideoToMp4 = () => {
        let outputH264 = camera.get("output");
        let outputMp4 = outputH264.slice(0, outputH264.indexOf("h264")) + "mp4";

        let ls = spawn('ffmpeg', ['-framerate', '50', '-i', outputH264, '-c', 'copy', outputMp4]);


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


}
