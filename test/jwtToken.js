
var jwt = require('jwt-simple'),
    moment = require('moment');

var jwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzcGVlZElkIjoiNTljYTNjMzVjZjgzMDQxMGIwN2ZkYTAyIiwiZW1haWwiOiJzaGFpa2hpbXJhbjExNUBnbWFpbC5jb20iLCJpc3MiOiJ0ZWNoZm9yY2UiLCJpYXQiOjE1MDY0MjU5MDksImV4cCI6MTUwNjQyOTUwOX0.KcNROMYuEC4cIas7g4eGZvqHGWheYfJcdNz1NQYwAOY'
/*
check jwt token exiperation time
*/
ensureAuthenticated(jwtToken, function (err, result) {
    if (err) {
        console.log('error', err);
    } else {
        console.log('success');
        console.log(result);
    }
});

/*Authentication interceptor*/
function ensureAuthenticated(jwtToken, callback) {
    decodeToken(jwtToken, function (err, payload) {
        if (err) {
            console.log('--->Invalid token', err);
            return callback({
                code: 401, message: '=>Invalid token',
                status: 'failed', reason: 'Invalid token'
            });
        }
        if (payload.exp <= moment().unix()) {
            return callback({
                code: 401, message: "Session expired please login again",
                status: 'failed', reason: 'Session expired'
            });
        }
        if (payload.iss != 'techforce') {
            return callback({
                code: 401, message: '=>Invalid token',
                status: 'failed', reason: 'Invalid token'
            });
        }
        return callback(null, { code: 200, status: 'success', payload: payload });
    });
}

/*
Decoding JWT token 
Decoded token payload
{
     speedId: '59ca3c35cf830410b07fda02',
     email: 'shaikhimran115@gmail.com',
     iss: 'techforce',
     iat: 1506425909,
     exp: 1506429509
}
*/
function decodeToken(jwtToken, callback) {
    var secretKey = '585b82tehfrocesecret66e0e451';
    try {
        var payload = jwt.decode(jwtToken, secretKey);
        console.log(payload);
        callback(null, payload);
    } catch (err) {
        callback({ message: err.message });
    }
}




