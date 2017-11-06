
//build in modules
var async = require('async'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    ObjectID = require('mongodb').ObjectID,
    passwordHash = require('password-hash');


//custom modules
var auth = require('app/helpers/auth'),
    BlogDao = require('app/dao/blog'),
    C = require('app/helpers/constant'),
    log = require('utils/logger')(module),
    Blog = require('app/models/blog'),
    User = require('app/models').User,
    UserDao = require('app/dao/user');

var UserOperations = {
    createBlog: createBlog,
    userSignin: userSignin,
    userSignup: userSignup,
    fetchBlogs: fetchBlogs,
    fetchBlogById: fetchBlogById,
    updateBlog: updateBlog,
    deleteBlogById: deleteBlogById
}

function createBlog(blogInfo, callback) {
    log.info('<--------------createBlog---------------->');
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
                BlogDao.createBlog(blog, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, { statusCode: 201, message: "blog created" });
                });
            }
        }
    ], callback);
}

function userSignup(userInfo, callback) {
    log.info('<--------------signup---------------->');
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
                var isPasswordCorrect = passwordHash.verify(userInfo.password, userDetail.password)
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
function fetchBlogs(callback) {
    log.info('<--------------fetchBlogs---------------->');
    BlogDao.fetchBlogs(function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}


function fetchBlogById(id, callback) {
    log.info('<--------------fetchBlogById---------------->');
    if (!id) {
        return callback(null, "please provide id");
    }
    BlogDao.fetchBlogById(id, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}


function updateBlog(id, blogInfo, callback) {
    log.info('<--------------updateBlog---------------->');
    if (!id) {
        return callback(null, "please provide id");
    }
    BlogDao.updateBlog(id, blogInfo, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}


function deleteBlogById(id, callback) {
    log.info('<--------------deleteCategoryById---------------->');
    if (!id) {
        return callback(null, "please provide id");
    }
    BlogDao.deleteBlogById(id, function (err, users) {
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
