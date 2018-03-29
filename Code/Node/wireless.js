/*

value:      "ON" | "OFF"
switchId:   1 | 2 | 4 | 8

*/
exports.transmitToWirelessSwitch = (value, switchId) => {
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