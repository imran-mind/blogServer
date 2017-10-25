'use strict';
/**
 * @author: Vinayak Sharan
 * @email: vinayak.sharan@47billion.com
 */
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


var constants = {
    decodeToken: decodeToken,
    decodeJWTToken: decodeJWTToken,
    createJWT: createJWT,
    createRefreshJWT: createRefreshJWT,
    ensureAuthenticated: ensureAuthenticated,
    okResponse: okResponse,
    createResponse: createResponse,
    updateResponse: updateResponse,
    conflictResponse: conflictResponse,
    notFoundResponse: notFoundResponse,
    deleteResponse: deleteResponse,
    errorResponse: errorResponse,
    invalidResponse: invalidResponse,
    notModifiedResponse: notModifiedResponse,
    unAuthResponse: unAuthResponse,
    genericResponse: genericResponse
};



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



constants.HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 200,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
};


constants.NZ_STATUS_CODES = {
    OK: 2000,
    SUCCESS: 2000,
    CREATED: 2001,
    ACCEPTED: 2002,
    NO_CONTENT: 2004,
    NOT_MODIFIED: 3004,
    BAD_REQUEST: 4000,
    UNAUTHORIZED: 4001,
    FORBIDDEN: 4003,
    NOT_FOUND: 2000,
    CONFLICT: 4009,
    INTERNAL_SERVER_ERROR: 5000,
    BAD_GATEWAY: 5002,
    SERVICE_UNAVAILABLE: 5003
};


constants.STATUS = {
    SUCCESS: 'success',
    CONFLICT: 'conflict',
    FAILED: 'failed',
    NOT_FOUND: 'Not Found',
    BAD_REQUEST: 'Bad request',
    NOT_MODIFIED: 'Not Modified'
};


constants.REASONS = {
    SERVER_ERROR_HAPPENED: 'Internal server error happened',
    ALREADY_EXIST: 'resource already exist',
    CREATED: 'resource created successful',
    SUCCESSFUL: 'resource successful',
    UPDATE_SUCCESS: 'resource update successful',
    NOT_FOUND: 'resource not found',
    FOUND: 'resource found',
    DELETE_SUCCESS: 'resource delete successful',
    BAD_REQUEST: 'Bad request',
    PARAMS_NOT_FOUND: 'request params not found',
    NOT_MODIFIED: 'Not Modified',
    UNAUTHORIZED: 'Unauthorized request'
};


//Roles
constants.ROLE = {
    ADMIN: 'admin',
    USER: 'user',
    SUPER_ADMIN: 'superadmin'
};


constants.S3_BUCKET = {
    BASE_URL: 'https://s3-us-west-2.amazonaws.com/nazara/'
};


constants.BIQ_QUERY_EVENT = {};


function createResponse(message, data) {
    return {
        message: message ? message : constants.REASONS.CREATED,
        statusCode: constants.HTTP_STATUS_CODES.CREATED
    };
}


function okResponse(message, data, reason) {
    return {
        message: message ? message : constants.REASONS.FOUND,
        statusCode: constants.HTTP_STATUS_CODES.OK
    };
}


function updateResponse(message, data) {
    return {
        code: constants.NZ_STATUS_CODES.ACCEPTED, message: message ? message : constants.REASONS.UPDATE_SUCCESS,
        status: constants.STATUS.SUCCESS, reason: constants.REASONS.UPDATE_SUCCESS,
        statusCode: constants.HTTP_STATUS_CODES.ACCEPTED, data: data ? data : {}
    };
}


function conflictResponse(message) {
    return {
        message: message ? message : constants.REASONS.ALREADY_EXIST,
        statusCode: constants.HTTP_STATUS_CODES.CONFLICT
    }
}


function notFoundResponse(message, code, data) {
    return {
        message: message ? message : constants.REASONS.NOT_FOUND,
        statusCode: code ? code : constants.HTTP_STATUS_CODES.NOT_FOUND
    };
}


function deleteResponse(message) {
    return {
        code: constants.NZ_STATUS_CODES.ACCEPTED, message: message ? message : constants.REASONS.DELETE_SUCCESS,
        status: constants.STATUS.SUCCESS, reason: constants.REASONS.DELETE_SUCCESS,
        statusCode: constants.HTTP_STATUS_CODES.ACCEPTED
    }
}


function errorResponse(err, errorReasonMessage, statusCode, code) {
    return {
        code: code ? code : constants.NZ_STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: err ? err.message : err,
        status: constants.STATUS.FAILED,
        reason: errorReasonMessage ? errorReasonMessage : constants.REASONS.SERVER_ERROR_HAPPENED,
        statusCode: statusCode ? statusCode : constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    };
}


function invalidResponse(message) {
    return {
        code: constants.NZ_STATUS_CODES.BAD_REQUEST, message: message ? message : constants.REASONS.BAD_REQUEST,
        status: constants.STATUS.BAD_REQUEST, reason: constants.REASONS.BAD_REQUEST,
        statusCode: constants.HTTP_STATUS_CODES.BAD_REQUEST, data: {}
    };
}

function notModifiedResponse(message) {
    return {
        code: constants.NZ_STATUS_CODES.NOT_MODIFIED, message: message ? message : constants.REASONS.NOT_MODIFIED,
        status: constants.STATUS.NOT_MODIFIED, reason: constants.REASONS.NOT_MODIFIED,
        statusCode: constants.HTTP_STATUS_CODES.NOT_MODIFIED, data: {}
    };
}

function unAuthResponse(message, statusCode) {
    return {
        message: message ? message : constants.REASONS.UNAUTHORIZED,
        statusCode: statusCode ? statusCode : constants.HTTP_STATUS_CODES.UNAUTHORIZED
    };
}

function genericResponse(token, name) {
    return {
        statusCode: constants.HTTP_STATUS_CODES.OK,
        token: token,
        message: 'success',
        name: name
    };
}

module.exports = constants;
