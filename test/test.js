var google = require('googleapis'),
    jwt = require('jwt-simple');

var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
/*var oauth2Client = new OAuth2(
 "43685965118-kimgbj00tccufsavv32qa7k4ko1n4a6a.apps.googleusercontent.com",
 "2OpkpcWKs12tzWEItlRqC7Dv"
 //"http://localhost:8080/speedops/auth/google/callbac"
 );

 // Retrieve tokens via token exchange explained above or set them:
 oauth2Client.setCredentials({
 // access_token: 'ya29.GlvLBFOBkyhKaA-AwXI2zPVLVe_2LEs0LQQkzPGTejK3oObOeaR_uEak1QteWG2mV_TqVQOeBxX1_x-Y0VOzZ04JNmxreh1h7ahe0tKXAUMQrCz7nB2MFInRSE5a',
 refresh_token: '1/KDhgrZTOe5ACV4pZct0mA_WBZZpKOShaJJYbo0o0y8s'
 // Optional, provide an expiry_date (milliseconds since the Unix Epoch)
 // expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)
 });


 oauth2Client.refreshAccessToken(function (err, tokens) {
 console.log('============refres================');
 console.log(tokens);
 // your access_token is now refreshed and stored in oauth2Client
 // store these new tokens in a safe place (e.g. database)
 });*/

//var url = "https://api.github.com/applications/c9a57b0690eefc6540d8/tokens/b8d92598112650e420839ab72ed1060965dd3472";
var url = "https://api.github.com";

var request = require('request');

request({
        method: 'GET',
        uri: url,
        //body: JSON.stringify(body),
        headers: {
            'Content-Type': 'text/html',
            'User-Agent': '',
            'Authorization': 'token 1a9f5a58c553cde5850de3015f473f1e1b30e29c'
        }
    },
    function (error, response, body) {
        if (error) {
            console.log(error);
        }
        console.log(JSON.stringify(response));
    }
);


var url = "https://www.linkedin.com/oauth/v2/accessToken";
/*
var request = require('request');
var body = {
    "grant_type": "authorization_code",
    "code": "81--31e4d816-53b9-4ee0-af7d-30549b959af2",
    "refresh_token": "55224538-6202-412b-8f77-b4bab1f88bfe",
    "redirect_uri":"http://localhost:8080/speedops/auth/linkedin/callback",
    "client_id":"86fuvgta3co1yw",
    "client_secret":"UoxHfT2BvPgctW39"
}

request({
        method: 'POST',
        uri: url,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
           *//* 'User-Agent': '',
            'oauth_token': '55224538-6202-412b-8f77-b4bab1f88bfe'*//*
            //'Authorization' :'Bearer 55224538-6202-412b-8f77-b4bab1f88bfe'
        }
    },
    function (error, response, body) {
        if (error) {
            console.log('<-------------error---------------->')
            console.log(error);
        }
        console.log('<-------------success---------------->')
        console.log(JSON.stringify(response));
    }
);*/



var querystring = require('querystring');
var request = require('request');

/*
var form = {
    grant_type: 'authorization_code',
    //code: '81--31e4d816-53b9-4ee0-af7d-30549b959af2',
    code:'81--f823d8b2-afd5-4309-9bd0-5cac4e3df958',
    refresh_token: '55224538-6202-412b-8f77-b4bab1f88bfe',
    redirect_uri:'http://localhost:8080/speedops/auth/linkedin/callback',
    client_id:'86fuvgta3co1yw',
    client_secret:'UoxHfT2BvPgctW39'
};
*/
/*
var form = {
    grant_type: 'authorization_code',
    //code: '81--31e4d816-53b9-4ee0-af7d-30549b959af2',
    code:'81--f823d8b2-afd5-4309-9bd0-5cac4e3df958',
    refresh_token: '55224538-6202-412b-8f77-b4bab1f88bfe',
    redirect_uri:'http://localhost:8080/speedops/auth/linkedin/callback',
    client_id:'86fuvgta3co1yw',
    client_secret:'UoxHfT2BvPgctW39'
};

var formData = querystring.stringify(form);
var contentLength = formData.length;

request({
    headers: {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection':'Keep-Alive',
        'Authorization':'Bearer '//'Bearer 32ec8593-9f37-4d5c-a5ab-245b8513727e'
    },
    //uri: 'https://www.linkedin.com/oauth/v2/accessToken',
    uri: 'https://api.linkedin.com/v1/people',
    //body: formData,
    method: 'GET'
}, function (err, res, body) {
    if (err) {
        console.log('<-------------error---------------->')
        console.log(err);
    }
    console.log('<-------------success---------------->')
    console.log(res);

    console.log('<-------------body---------------->')
    console.log(body    );

});*/
