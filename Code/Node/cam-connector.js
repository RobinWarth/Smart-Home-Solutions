exports.switchOnOff = (value) => {

    if(value === "ON"){
        switchOn();
    }else if (value === "OFF") {
        switchOff();
    }else{
        console.log("unknown value!");
    }
    
    
    
};

let switchOn = () => {
    console.log("camera: switch On!");
    // [TODO]
    
    
};

let switchOff = () => {
    console.log("camera: switch Off!");
    // [TODO]
    
    
}



/*
    Beispiel: für python skript aufruf (falls du das machen willst):

  let spawn = require("child_process").spawn;
  let process = spawn('python', ["../elropi.py", id, 1]);


  process.stdout.on('data', function(data) {
    console.log(data.toString('utf8')); // buffer to string);
  });
  
*/