

var log = require('utils/logger')(module);
var User = require('app/models').User;



var UserOperations = {
    userSignup: userSignup,
    fetchUsers: fetchUsers,
    fetchUserById: fetchUserById,
    findUserByCondition: findUserByCondition,
    updateUser: updateUser,
    deleteUserById: deleteUserById
}

function userSignup(user, callback) {
    log.info('----------userSignup------------', JSON.stringify(user));
    user.save(function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, 'result');
    });
}

function fetchUsers(callback) {
    log.info('----------fetchUsers------------');
    User.find(function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}

function fetchUserById(id, callback) {
    log.info('----------fetchUserById------------');
    User.findOne({ _id: id /*ObjectId(id)*/ }, { __v: 0 }, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}

function findUserByCondition(condition, callback) {
    log.info('----------findUserByCondition------------');
    console.log(condition);
    User.findOne(condition, {}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}

function updateUser(id, userInfo, callback) {
    log.info('----------updateUser------------');
    console.log('------user dao--id---', id);
    console.log('------user dao--userinfo---', userInfo);
    User.update({ _id: id }, userInfo, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}

function deleteUserById(id, callback) {
    log.info('----------deleteUserById------------');
    User.remove({ _id: id }, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}


module.exports = UserOperations;
