require('rootpath');
var BlogService = require('app/service/blog'),
    UserService = require('app/service/user'),
    log = require('utils/logger')(module);

var UserOperations = {
    createBlog: createBlog,
    userSignup: userSignup,
    userSignin: userSignin,
    fetchBlogs: fetchBlogs,
    fetchBlogById: fetchBlogById,
    updateBlog: updateBlog,
    deleteBlogById: deleteBlogById
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

function userSignup(req, res) {
    log.info('<--------------userSignup--blog-------------->', req.body);
    BlogService.userSignup(req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(result.statusCode).json(result);
    });
}


function userSignin(req, res) {
    log.info('<--------------userSignin---------------->');
    BlogService.userSignin(req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        console.log(result);
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

function fetchBlogById(req, res) {
    log.info('<--------------fetchBlogById---------------->');
    BlogService.fetchBlogById(req.params.id, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: result });
    });
}

function updateBlog(req, res) {
    log.info('<--------------updateBlog---------------->');
    BlogService.updateBlog(req.params.id, req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: result });
    });
}


function deleteBlogById(req, res) {
    log.info('<--------------deleteBlogById---------------->', req.params.id);
    BlogService.deleteBlogById(req.params.id, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: result });
    });
}

module.exports = UserOperations;
