const fs = require('fs');
const { spawn } = require('child_process');

class CamController {

    constructor() {

        this.initalCheckForRunningFFServerProcess = true;

        this.RaspividTime = 3600000;
        this.RaspividFps = 8;
        this.RaspividWidth = 640;
        this.RaspividHeight = 360;

        let new_dir = "/../../../Records/";
        this.path = process.cwd().concat(new_dir);


        if (!fs.existsSync(this.path)) {
            console.log("to create");
            fs.mkdirSync(this.path);
        }
        this.output = this.path.concat("default", ".h264"); //default

        this.raspividProcess = null;

        this.killingFFServerProcess = null;

        this.ffserverProcess = null;
        this.initialFFServerStart();

    }


    startRecording() {

        let d = new Date();
        let time_string = d.toTimeString();
        let time = time_string.split(' ')[0].replace(/:/g, "-");

        let date = d.toString();
        let dates = date.split(' ');
        let date_string = dates[2].concat(dates[1].concat(dates[3]));

        let full_date = date_string.concat("_".concat(time));

        this.output = this.path.concat(full_date, ".h264");




        // called every time, when FFServer Process is killed to start raspivid (-> only reason to kill ffserver)
        this.setFFServerExitListener(() => {

            // raspivid -o video.h264 -t 10000
            this.raspividProcess = spawn('raspivid', ['-o', this.output, '-t', this.RaspividTime, '-w', this.RaspividWidth, '-h', this.RaspividHeight, '-fps', this.RaspividFps]);

            this.setAllRaspividListeners();
        });
        this.killFFServerProcess();


    }

    stopRecording() {
        console.log("camera: stop recording!");
        //console.log("my output is: " + this.camera.get("output"));

        if (this.raspividProcess) {
            this.raspividProcess.kill();
            //this.raspividProcess = null;
        }

    }

    setAllRaspividListeners() {
        this.setRaspividOutDataListener();
        this.setRaspividOutErrListener();
        this.setRaspividExitListener();
    }

    setRaspividOutDataListener() {
        this.raspividProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
    }

    setRaspividOutErrListener() {
        this.raspividProcess.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
    }

    setRaspividExitListener() {
        this.raspividProcess.on('exit', (code) => {
            console.log(`child process exited with code ${code}`);
            this.convertLastVideoToMp4();
            this.startFFserverProcess();
        });
    }

    /* need?
    setFFServerCloseListener() {
        this.ffserverProcess.on('close', (code) => {
            console.log(`ffserverProcess - child process exited with code ${code}`);
        });
    }
    */
    setFFServerErrListener(callback) {
        this.ffserverProcess.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
    }

    setFFServerOutListener(callback) {
        this.ffserverProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
    }

    setFFServerExitListener(callback) {
        this.ffserverProcess.on('exit', (code) => {
            console.log(`ffserverProcess - child process exited with code ${code}`);
            callback();
        });
    }

    startFFserverProcess() {
        this.ffserverProcess = spawn('../../Install-Scripts/reconfigure_ffmpeg');
        this.setFFServerExitListener(() => {});
    }

    initialFFServerStart() {
        this.killFFServerProcess();

        this.setKillingFFServerProcessExitListener(() => {
            if (this.initalCheckForRunningFFServerProcess) {
                this.initalCheckForRunningFFServerProcess = false;
                this.startFFserverProcess();
            }
        });
    }


    setKillingFFServerProcessExitListener(callback) {
        this.killingFFServerProcess.on('exit', (code) => {
            console.log(`killignProcess - child process exited with code ${code}`);
            callback();
        });
    }

    killFFServerProcess() {
        this.killingFFServerProcess = spawn('pkill', ['-f', 'ffserver']);
    }


    convertLastVideoToMp4() {
        let outputH264 = this.output;
        let outputMp4 = outputH264.slice(0, outputH264.indexOf("h264")) + "mp4";

        let ls = spawn('ffmpeg', ['-framerate', this.RaspividFps, '-i', outputH264, '-c', 'copy', outputMp4]);
        console.log("convert to mp4...");


        ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

    }


}



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
