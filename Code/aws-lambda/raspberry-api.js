var http = require('http');

exports.sendToRaspberry = (id, status, context, callback) => {
    
    /* faked: the real powerState should come from Raspberry in the response */
    let powerResult = "OFF";
    if(status === 1){
        powerResult = "ON"
    }
    
    

    var body = JSON.stringify({
        id: id,
        status: status
    });


    const options = {
        hostname: 'test.io', //no real data
        port: 80,
        path: '/input',
        method: 'POST',
        auth: 'please:change', //no real data
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        },

    };

    const req = http.request(options, (res) => {

        res.setEncoding('utf8');
        
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            callback(null, context, JSON.parse(chunk));
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
        
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        callback(e, context, null);
    });

    // write data to request body
    console.log(body);
    req.end(body);
};


exports.statusFromRaspberry = (context, callback) => {
    

    const options = {
        hostname: 'test.io', //no real data
        port: 80,
        path: '/output',
        method: 'GET',
        auth: 'please:change', //no real data
        headers: {
            'Content-Type': 'application/json'
        },

    };

    const req = http.request(options, (res) => {

        res.setEncoding('utf8');
        
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            callback(null, context, JSON.parse(chunk));
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        callback(e, context, null);
    });

    // write data to request body
    req.end();
};

// exports.state_wirelessSwitch1 = "ON";