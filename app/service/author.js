
//build in modules
var async = require('async'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    ObjectID = require('mongodb').ObjectID;


//custom modules
var auth = require('app/helpers/auth'),
    AuthorDao = require('app/dao/author'),
    C = require('app/helpers/constant'),
    log = require('utils/logger')(module),
    Author = require('app/models/author');

var UserOperations = {
    createAuthor: createAuthor,
    userSignin: userSignin,
    fetchAuthors: fetchAuthors,
    fetchAuthorById: fetchAuthorById,
    updateAuthor: updateAuthor,
    deleteAuthorById:deleteAuthorById
}

function createAuthor(authorInfo, callback) {
    log.info('<--------------createAuthor---------------->');
    console.log(authorInfo);
    var author = new Author({
        id: ObjectID.toString(),
        name: authorInfo.name,
        email: authorInfo.email,
        mobile: authorInfo.mobile,
        deleted: false,
        createdAt: moment().valueOf(),
        updatedAt: moment().valueOf()
    });

    var condition = {
        name: authorInfo.name,
    };
    async.waterfall([
        function (callback) {
            AuthorDao.findAuthorByCondition(condition, callback);
        },
        function (authorObject, callback) {
            if (authorObject) {
                return callback(null, { statusCode: 409, message: "name already exist" });
            } else {
                console.log('***********************', authorObject);
                AuthorDao.createAuthor(author, function (err, result) {
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

function fetchAuthors(callback) {
    log.info('<--------------fetchBlogs---------------->');
    AuthorDao.fetchAuthors(function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}


function fetchAuthorById(id, callback) {
    log.info('<--------------fetchUserById---------------->');
    if (!id) {
        return callback(null, "please provide id");
    }
    AuthorDao.fetchAuthorById(id, function (err, author) {
        if (err) {
            return callback(err);
        }
        callback(null, author);
    });
}


function updateAuthor(id, userInfo, callback) {
    log.info('<--------------updateAuthor---------------->');
    if (!id) {
        return callback(null, "please provide id");
    }
    AuthorDao.updateAuthor(id, userInfo, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}


function deleteAuthorById(id, callback) {
    log.info('<--------------deleteCategoryById---------------->');
    if (!id) {
        return callback(null, "please provide id");
    }
    AuthorDao.deleteAuthorById(id, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}





module.exports = UserOperations;
