

require('rootpath');
var UserService = require('app/service/user'),
    log = require('utils/logger')(module);

var UserOperations = {
    userSignup: userSignup,
    userSignin: userSignin,
    fetchUsers: fetchUsers,
    fetchUserById: fetchUserById,
    updateUser: updateUser
}

function userSignup(req, res) {
    log.info('<--------------userSignup---------------->');
    UserService.userSignup(req.body, function (err, result) {
        console.log('-----------req.body--------------',req.body);
        if (err) {
            return res.status(500).json(err);
        }
        res.status(result.statusCode).json(result);
    });
}

function userSignin(req, res) {
    log.info('<--------------userSignin---------------->');
    console.log('-------------------------', JSON.stringify(req.body));
    if (!req.body || req.body == {}) {
        return res.status(400).json({ code: 400, message: "please provide username and password" });
    }
    UserService.userSignin(req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(result.statusCode).json(result);
    });
}

function fetchUsers(req, res) {
    log.info('<--------------userSignup---------------->');
    UserService.fetchUsers(function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: result });
    });
}

function fetchUserById(req, res) {
    log.info('<--------------fetchUserById---------------->');
    UserService.fetchUserById(req.params.userId, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: result });
    });
}

function updateUser(req, res) {
    log.info('<--------------updateUser---------------->');
    UserService.updateUser(req.params.userId, req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: result });
    });
}

module.exports = UserOperations;
