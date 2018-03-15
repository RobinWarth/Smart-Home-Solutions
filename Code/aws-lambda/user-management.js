const https = require('https');

/* mockup for a database lookup */
exports.checkUser = (bearerToken, callbackUserHost) => {

    obtainCustomerProfileInformation(bearerToken, (user) => {
        if (user.user_id === 'amzn1.account.ABC') { //user_id Robin
            callbackUserHost('robin.eu.ngrok.io', 'bla:blub');
        }
        else if (user.user_id === 'amzn1.account.XYZ') { //user_id Max
            callbackUserHost('max.eu.ngrok.io', 'test:test');
        }
        else {
            callbackUserHost('xyz.eu.ngrok.io', 'test:test');
        }

    });


};

/*
Obtain Customer Profile Information:

To access the authorized customer data, you submit that access token to Login with Amazon using HTTPS.

In response, Login with Amazon will return the appropriate customer profile data. 
The profile data you receive is determined by the scope you specified when requesting access. 
The access token reflects access permission for that scope. 
-https://developer.amazon.com/de/docs/login-with-amazon/obtain-customer-profile.html 
*/
let obtainCustomerProfileInformation = (bearerToken, callbackProfileInformation) => {


    const options = {
        hostname: 'api.amazon.com',
        path: '/user/profile',
        method: 'GET',
        headers: {
            Authorization: 'bearer ' + bearerToken
        }
    };


    const req = https.request(options, (res) => {

        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            console.log(`RESPONSE Obtain Customer Profile Information: ${chunk}`);
            callbackProfileInformation(JSON.parse(chunk));
        });

        res.on('end', () => {
            console.log(`RESPONSE Obtain Customer Profile Information: No more data in response`);
        });

    });

    req.on('error', (e) => {
        console.error(`RESPONSE-Error Obtain Customer Profile Information: problem with request: ${e.message}`);

    });

    req.end();
};
