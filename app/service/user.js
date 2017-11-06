
//build in modules
var async = require('async'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    ObjectID = require('mongodb').ObjectID,
    passwordHash = require('password-hash');

//custom modules
var C = require('app/helpers/constant'),
    log = require('utils/logger')(module),
    UserDao = require('app/dao/user'),
    User = require('app/models').User,
    auth = require('app/helpers/auth');

var UserOperations = {
    userSignup: userSignup,
    userSignin: userSignin,
    fetchUsers: fetchUsers,
    fetchUserById: fetchUserById,
    updateUser: updateUser
}

function userSignup(userInfo, callback) {
    log.info('<--------------signup---------------->');
    console.log(userInfo);

    var user = new User({
        id: ObjectID.toString(),
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        username: userInfo.username
    });
    var condition = {
        username: userInfo.username
    };
    async.waterfall([
        function (callback) {
            UserDao.findUserByCondition(condition, callback);
        },
        function (userObject, callback) {
            if (userObject) {
                return callback(null, C.okResponse('username already exist'));
            } else {
                user.password = passwordHash.generate(userInfo.pwd);
                console.log('---------new hashed password0---------', user.password);
                UserDao.userSignup(user, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, C.createResponse('user signup successfully'));
                });
            }
        }
    ], callback);
}

function userSignin(userInfo, callback) {
    log.info('<--------------userSignin---------------->');
    var condition = {
        username: userInfo.username
    }
    async.waterfall([
        function (success) {
            UserDao.findUserByCondition(condition, success);
        },
        function (userDetail, callback) {
            if (!userDetail) {
                return callback(null, { message: "invalid username or password", statusCode: 401 });
            } else {
                // callback(null, C.genericResponse(/* C.createJWT(userDetail), */ userDetail.firstName));
                var isPasswordCorrect = passwordHash.verify(userInfo.password, userDetail.password)
                console.log('*************************** ', isPasswordCorrect);
                if (!isPasswordCorrect) {
                    return callback(null, C.unAuthResponse('Invalid username or password'));
                }
                else {
                    callback(null, C.genericResponse(C.createJWT(userDetail), userDetail.firstName));
                }
            }
        }
    ], callback);
}

function fetchUsers(callback) {
    log.info('<--------------fetchUsers---------------->');
    UserDao.fetchUsers(function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}


function fetchUserById(id, callback) {
    log.info('<--------------fetchUserById---------------->');
    if (!id) {
        return callback(null, "please provide userId");
    }
    UserDao.fetchUserById(id, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}


function updateUser(id, userInfo, callback) {
    log.info('<--------------updateUser---------------->');
    if (!id) {
        return callback(null, "please provide userId");
    }
    console.log('---service userid ---', id);
    console.log('-------userInfo----', userInfo);
    UserDao.updateUser(id, userInfo, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}




/**
 * Function generateSalt generates a random from a set of charecters
 * @memberof GMSUser
 * @returns {string} Salt
 */
var generateSalt = function () {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};


/**
 * Function md5 create hash of passed string
 * @memberof GMSUser
 * @param {string} str String to encrypt
 * @returns {string}
 */
var md5 = function (str) {
    return crypto.createHash('md5').update(str).digest('hex');
};


/**
 * Function saltAndHash concatenate salt and encrypted password
 * @memberof GMSUser
 * @param {string} pass Users password
 * @param {callback} callback
 * @returns {string}
 */
var saltAndHash = function (pass, callback) {
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
};


/**
 * Function validatePassword validate the password passed in request should match with encrypted password in database
 * @memberof Admin
 * @param {string} plainPass Pain password string
 * @param {string} hashedPass Hashed password from database
 * @param {callback} cb
 * @returns {boolean}
 */
var validatePassword = function (plainPass, hashedPass, cb) {
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    cb(null, hashedPass === validHash);
};

module.exports = UserOperations;
