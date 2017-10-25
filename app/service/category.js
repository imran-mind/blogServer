
//build in modules
var async = require('async'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    ObjectID = require('mongodb').ObjectID;


//custom modules
var auth = require('app/helpers/auth'),
    C = require('app/helpers/constant'),
    CategoryDao = require('app/dao/category'),
    log = require('utils/logger')(module),
    Category = require('app/models').Category;

var UserOperations = {
    createCategory: createCategory,
    userSignin: userSignin,
    fetchCategories: fetchCategories,
    fetchCategoryById: fetchCategoryById,
    updateCategory: updateCategory,
    deleteCategoryById: deleteCategoryById
}

function createCategory(category, callback) {
    log.info('<--------------createCategory---------------->');
    console.log(category);
    var category = new Category({
        id: ObjectID.toString(),
        name: category.name,
        type: category.type,
        deleted: false,
        createdAt: moment().valueOf(),
        updatedAt: moment().valueOf()
    });

    var condition = {
        name: category.name,
    };
    async.waterfall([
        function (callback) {
            CategoryDao.findCategorByCondition(condition, callback);
        },
        function (categoryObject, callback) {
            if (categoryObject) {
                return callback(null, { statusCode: 409, message: "name already exist" });
            } else {
                console.log('***********************', categoryObject);
                CategoryDao.createCategory(category, function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    console.log('-------------------', result);
                    callback(null, { statusCode: 201, message: "category created" });
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

function fetchCategories(callback) {
    log.info('<--------------fetchCategories---------------->');
    CategoryDao.fetchCategories(function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}



function fetchCategoryById(id, callback) {
    log.info('<--------------fetchCategoryById---------------->');
    if (!id) {
        return callback(null, "please provide id");
    }
    CategoryDao.fetchCategoryById(id, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}


function deleteCategoryById(id, callback) {
    log.info('<--------------deleteCategoryById---------------->');
    if (!id) {
        return callback(null, "please provide id");
    }
    CategoryDao.deleteCategoryById(id, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}


function updateCategory(id, categoryInfo, callback) {
    log.info('<--------------updateCategory---------------->');
    if (!id) {
        return callback(null, "please provide id");
    }
    CategoryDao.updateCategory(id, categoryInfo, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}



module.exports = UserOperations;
