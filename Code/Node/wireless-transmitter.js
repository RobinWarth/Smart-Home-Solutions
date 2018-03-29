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
exports.transmitToWirelessSwitch = (value, switchId, homeKey) => {
    let valueNumber = 0;
    if(value === "On"){
        valueNumber = 1;
    }


    // [TODO]
    doSomething(valueNumber, switchId); //example
}


let doSomething = (bla, blubb) => {
    // [TODO]
}