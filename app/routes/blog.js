require('rootpath');
var BlogService = require('app/service/blog'),
    log = require('utils/logger')(module);

var UserOperations = {
    createBlog: createBlog,
    userSignin: userSignin,
    fetchBlogs: fetchBlogs,
    fetchUserById: fetchUserById,
    updateUser: updateUser
}

function createBlog(req, res) {
    log.info('<--------------createBlog---------------->');
    BlogService.createBlog(req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(result.statusCode).json(result);
    });
}

function userSignin(req, res) {
    log.info('<--------------userSignin---------------->');
    UserService.fetchCategories(req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(result);
    });
}

function fetchBlogs(req, res) {
    log.info('<--------------fetchBlogs---------------->');
    BlogService.fetchBlogs(function (err, blogs) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: blogs });
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
