/**
 * @author: Imran Shaikh
 * @email: shaikhimran115@gmail.com
 * The file contains authentication utils and middlewares to
 * ensure whether the user is authenticated or not.
 * */

require('rootpath')();
var config = require('config'),
    debug = require('debug')('helpers.auth'),
    moment = require('moment'),
    log = require('utils/logger')(module),
    jwt = require('jwt-simple'),
    jsonwebtoken = require('jsonwebtoken'),
    _ = require('lodash'),
    User = require('app/dao/user'),
    userService = require('app/service/user');

var AppConfig, App, Application, Vendor, flatList, accessControl;
var auth = {
    decodeToken: decodeToken,
    decodeJWTToken: decodeJWTToken,
    createJWT: createJWT,
    createRefreshJWT: createRefreshJWT,
    ensureAuthenticated: ensureAuthenticated
}

function decodeToken(authorization, callback) {
    var token = authorization.split(' ')[1];
    try {
        var payload = jwt.decode(token, config.token.secret);
        callback(null, payload);
    } catch (err) {
        callback({ message: err.message });
    }
}
function decodeJWTToken(authorization, callback) {
    try {
        var payload = jsonwebtoken.decode(authorization, {});
        callback(null, payload);
    } catch (err) {
        callback({ message: err.message });
    }
}

function createJWT(user) {
    var payload = {
        userId: user._id,
        email: user.username,
        iss: 'blogger',
        iat: moment().unix(),
        exp: moment().add(config.token.expiry, 'seconds').unix()
    };
    debug('--->JWT Payload - ', payload);
    return jwt.encode(payload, config.token.secret);
}

function createRefreshJWT(user) {
    var payload = {
        speedId: user.speedId,
        emailID: user.emailId
    };
    debug('--->refresh JWT Payload - ', payload);
    return jwt.encode(payload, config.token.secret);
}

/*Authentication interceptor*/
function ensureAuthenticated(req, res, next) {
    debug("header details", req.headers);
    if (!req.headers.authorization) {
        log.error('---==>token not present');
        return res.status(401).send({
            code: 401, message: 'Please make sure your request has an Authorization header',
            status: 'failed', reason: 'Invalid Auth header'
        });
    }
    var tokenDetail;
    if (tokenDetail = req.headers.authorization.split(' ').length !== 2) {
        log.error('--->Invalid token');
        return res.status(401).json({
            code: 401,
            message: '=>Invalid token',
            status: 'failed',
            reason: 'Invalid token'
        });
    }
    auth.decodeToken(req.headers.authorization, function (err, payload) {
        if (err) {
            log.error('--->Invalid token', err);
            return res.status(401).json({
                code: 401, message: '=>Invalid token',
                status: 'failed', reason: 'Invalid token'
            });
        }
        debug(">>> req.application and payload", payload);
        if (payload.exp <= moment().unix()) {
            return res.status(401).json({
                code: 401, message: "Session expired please login again",
                status: 'failed', reason: 'Session expired'
            });
        }
        req.userInfo = payload;
        return next();
    });
}


module.exports = auth;
