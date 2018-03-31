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

/* Vorbereitung zu WiringPi:

git clone git://git.drogon.net/wiringPi
cd wiringPi
git pull origin
cd wiringPi
./build

--> danach müsste das Skript laufen. 
Wenn ich das richtig sehe, musst du auch keine Belegung ändern, da
du sowie so schon den GPIO-Port am Pin 11 benutzt.

*/

exports.transmitToWirelessSwitch = (onoff, switchId) => {
    let homeKey = "01110";
    
    let rcswitch = require('rcswitch');
    rcswitch.enableTransmit(0);
    
    let device = 1;
    while(switchId != 1){
        switchId /= 2;
        device++;
    }
    
    if(onoff.toUpperCase() === "ON"){
        rcswitch.switchOn(homeKey, device);
    }else{
        rcswitch.switchOff(homeKey, device)
    }
    
    
}
require('make-runnable');

//let list = create_bit_list(onoff, switchId, homeKey);
    
     //switchOnOff(list); //example
/*
function switchOnOff(list){
    // [TODO]
    let repeat = 10;
    let pulselength = 300;
    
    //let Gpio = require('onoff').Gpio;
    //let socket = new Gpio(11, 'out');
    let liste = [1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    /*socket.write(0, function (err){
        if(err){
            throw err;
        }
    });
    for(let count = 0; count < repeat; count++){
        for(let i = 0; i < liste.length; i++){
            //output 7 list[i]
            socket.write(liste[i], function (err){
                if(err){
                    throw err;
                }
            });
            sleep(0.0003);
        }
    }
    */
    
   /* let rpio = require('rpio');
    rpio.open(11, rpio.OUTPUT, rpio.LOW);

    // output 7 low
    rpio.write(11, rpio.LOW);
    for(let count = 0; count < repeat; count++){
        for(let i = 0; i < liste.length; i++){
            //output 7 list[i]
            rpio.write(11, liste[i]);
            rpio.msleep(0.0003);
        }
    }
    
} 

function create_bit_list(onoff, device, key){
    
    let bit_list = new Array(16);
    
    for(let t = 0; t < 5; t++){
        if(key.charAt(t) == "0"){
            bit_list[t] = 142;
        }else{
            bit_list[t] = 136;
        }
    }
    
    let x = 1;
    for(let i = 1; i < 6; i++){
        if((device & x) > 0){
            bit_list[4+i] = 136;
        }else{
            bit_list[4+i] = 142;
        }
        x = x<<1;
    }
    
    if(onoff.toUpperCase() === "ON"){
        bit_list[10] = 136;
        bit_list[11] = 142;
    }else{
        bit_list[10] = 142;
        bit_list[11] = 136;
    }
    
    bit_list[12] = 128;
    bit_list[13] = 0;
    bit_list[14] = 0;
    bit_list[15] = 0;
    
    let bits = [];
    
    for(let y = 0; y < bit_list.length; y++){
        let x = 128;
        for(let i = 1; i < 9; i++){
            if((bit_list[y] & x)>0){
                bits.push(1);
            }else{
                bits.push(0);
            }
            x = x>>1;
        }    
    }
    
    return bits;   
}

function sleep(milliseconds){
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
        break;
    }
  }
}
*/