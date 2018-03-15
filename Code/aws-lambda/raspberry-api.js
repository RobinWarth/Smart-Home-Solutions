const https = require('https');
const userManagement = require('./user-management.js');

exports.sendToRaspberry = (attempt, bearerToken, callback) => {
    sendToUsersRaspberry(attempt, '/input', bearerToken, callback);
};


exports.statusFromRaspberry = (attempt, bearerToken, callback) => {
    sendToUsersRaspberry(attempt, '/output', bearerToken, callback);

};

let sendToUsersRaspberry = (attempt, path, bearerToken, callback) => {
    userManagement.checkUser(bearerToken, (hostname, auth) => {
        httpRaspberry(attempt, hostname, auth, path, callback);
    });
};


let httpRaspberry = (attempt, hostname, auth, path, callback) => {

    let body = JSON.stringify(attempt);


    const options = {
        hostname: hostname,
        port: 443,
        path: path,
        method: 'POST',
        auth: auth,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        },

    };

    const req = https.request(options, (res) => {

        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            console.log(`httpRaspberry [res.on('data')]: BODY: ${chunk}`);
            callback(null, JSON.parse(chunk));
        });

        res.on('end', () => {
            console.log(`httpRaspberry [res.on('end')]: No more data in response.`);
        });

    });

    req.on('error', (e) => {
        console.error(`httpRaspberry [req.on('error')]: problem with request: ${e.message}`);
        callback(e, context, null);
    });

    // write data to request body
    console.log("httpRaspberry request-body: ", body);
    req.end(body);
};
