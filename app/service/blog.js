
//build in modules
var async = require('async'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    ObjectID = require('mongodb').ObjectID;


//custom modules
var auth = require('app/helpers/auth'),
    BlogDao = require('app/dao/blog'),
    C = require('app/helpers/constant'),
    log = require('utils/logger')(module),
    Blog = require('app/models/blog');

var UserOperations = {
    createBlog: createBlog,
    userSignin: userSignin,
    fetchBlogs: fetchBlogs,
    fetchUserById: fetchUserById,
    updateUser: updateUser
}

function createBlog(blogInfo, callback) {
    log.info('<--------------createBlog---------------->');
    console.log(blogInfo);
    var blog = new Blog({
        id: ObjectID.toString(),
        name: blogInfo.name,
        title: blogInfo.title,
        subtitle: blogInfo.subtitle,
        content: blogInfo.content,
        deleted: false,
        createdAt: moment().valueOf(),
        updatedAt: moment().valueOf()
    });

    var condition = {
        name: blogInfo.name,
    };
    async.waterfall([
        function (callback) {
            BlogDao.findBlogByCondition(condition, callback);
        },
        function (blogObject, callback) {
            if (blogObject) {
                return callback(null, { statusCode: 409, message: "name already exist" });
            } else {
                console.log('***********************', blogObject);
                BlogDao.createBlog(blog, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    console.log('-------------------', result);
                    callback(null, { statusCode: 201, message: "blog created" });
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
                return callback(null, C.notFoundResponse('user not found with this username'));
            } else {
                validatePassword(userInfo.password, userDetail.password, function (err, res) {
                    if (err) {
                        return callback(C.errorResponse(err));
                    } else if (!res) {
                        return callback(null, C.unAuthResponse('Invalid username or password'));
                    }
                    else if (res) {
                        callback(null, C.genericResponse(auth.createJWT(userDetail)));
                    }
                });
            }
        }
    ], callback);
}

function fetchBlogs(callback) {
    log.info('<--------------fetchBlogs---------------->');
    BlogDao.fetchBlogs(function (err, users) {
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
