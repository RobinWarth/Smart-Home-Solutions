/*

https://pastebin.com/aRipYrZ6

http://www.jer00n.nl/433send.cpp


GPIO:
https://www.w3schools.com/nodejs/nodejs_raspberrypi_gpio_intro.asp
https://www.npmjs.com/package/onoff

*/



/*

value:      "ON" | "OFF"
switchId:   1 | 2 | 4 | 8
homeKey:    "01110"

*/
let gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
let sleep = require('sleep');

class RemoteSwitch {
    constructor(switchId, homeKey, pin){
        
        console.log("new RemoteSwitch...");
    
        this.pin = pin;
        this.device = switchId;
        this.key = homeKey;
        console.log(this.key);
        
        this.repeat = 10;
        this.pulselength = 300;
        
        this.output = new gpio(this.pin, 'out');
    }
    
    
    switchOn(){
        console.log("switch on...");
        this._switch("HIGH");
    }
    
    switchOff(){
        console.log("switch off...");
        this._switch("LOW");
    }
    
    _switch(sw){
        
        this.bit = [142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142, 136, 128, 0, 0, 0];
        
        for (let i = 0; i < 5; i++) {
            if(this.key.charAt(i) == 1){
                this.bit[i] = 136;
            }
        }
        
        let x = 1;
        for (let i = 1; i < 6; i++) {
            if((this.device & x) > 0){
                this.bit[4 + i] = 136;
            }
            x = x << 1;
        }
        
        if(sw === "HIGH"){
            this.bit[10] = 136;
            this.bit[11] = 142;
        }
        
        let bangs = [];
        for (let y = 0; y < 16; y++) {
            x = 128;
            for (let i = 1; i < 9; i++) {
                let b = (this.bit[y] & x) > 0 ? 1 : 0;
                bangs.push(b);
                x = x >> 1;
            } 
        }
        
        
        
        
        this.output.writeSync(0);
        
        
        for (let i = 0; i < this.repeat; i++) {
           for (let b of bangs) {
               this.output.writeSync(b);
               sleep.usleep(this.pulselength);
           }
            
        }
        
        //this.outputIntervall(bangs, 0);
        
    }
    
    
    /* outputIntervall(bangs, counter){
            //console.log("outputIntervall: " + counter);
            if(counter < bangs.length){
                
                this.output.writeSync(bangs[counter]);
                
                counter++;
                setTimeout(() => { this.outputIntervall(bangs, counter) }, 0.3);
            }else{
                this.repeat--;
                if(this.repeat !== 0){
                    this.outputIntervall(bangs, 0);
                }
               
            }
            
            
    }
    */
    
    
}




exports.transmitToWirelessSwitch = (switchId, value, homeKey) => {

    // [TODO]
    console.log("new test");
    let device = new RemoteSwitch(switchId, homeKey, 17); //example
    
    console.log(value);
    if(value === "ON"){
        device.switchOn();
    }else if(value === "OFF"){
        device.switchOff();
    }
    
};


