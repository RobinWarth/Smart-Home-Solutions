var http = require('http');

exports.sendToRaspberry = (attempt, context, callback) => {
    httpRaspberry(attempt, context, '/input', callback);
};


exports.statusFromRaspberry = (attempt, context, callback) => {
    httpRaspberry(attempt, context, '/output', callback);
};


let httpRaspberry = (attempt, context, path, callback) => {
    
    var body = JSON.stringify(attempt);

    const options = {
        hostname: 'ngrok.io',
        port: 80,
        path: path,
        method: 'POST',
        auth: 'bla:bla',
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

