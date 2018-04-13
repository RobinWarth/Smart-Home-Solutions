const https = require('https');
const userManagement = require('./user-management.js');

exports.sendToRaspberry = (attempt, bearerToken, callback) => {
    if(attempt.endpointId === "cameraSwitch"){
        sendToUsersRaspberry(attempt, '/cam-controller', 'POST', bearerToken, callback);
    }else{
        sendToUsersRaspberry(attempt, '/power-controller', 'POST', bearerToken, callback);
    }
    
};

exports.statusFromRaspberry = (attempt, bearerToken, callback) => {
    sendToUsersRaspberry(attempt, '/report-state', 'POST', bearerToken, callback);

};

exports.discoveryFromRaspberry = (bearerToken, callback) => {
    sendToUsersRaspberry({}, '/discovery', 'GET', bearerToken, callback);
};

let sendToUsersRaspberry = (attempt, path, method, bearerToken, callback) => {
    userManagement.checkUser(bearerToken, (hostname, auth) => {
        httpsRaspberry(attempt, hostname, auth, path, method, callback);
    });
};


let httpsRaspberry = (attempt, hostname, auth, path, method, callback) => {

    let body = JSON.stringify(attempt);


    const options = {
        hostname: hostname,
        port: 443,
        path: path,
        method: method,
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
