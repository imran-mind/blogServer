

var log = require('utils/logger')(module);
var Blog = require('app/models/blog');

var UserOperations = {
    createBlog: createBlog,
    fetchBlogs: fetchBlogs,
    fetchUserById: fetchUserById,
    findBlogByCondition: findBlogByCondition,
    updateUser: updateUser,
    deleteUserById: deleteUserById
}
function createBlog(blog, callback) {
    log.info('----------createBlog------------', JSON.stringify(blog));
    blog.save(function (err) {
        if (err) {
            return callback(err);
        }
        console.log('--------------success--------------');
        callback(null, 'result');
    });
}

function fetchBlogs(callback) {
    log.info('----------fetchBlogs------------');
    Blog.find({}, { deleted: 0 }, function (err, blogs) {
        if (err) {
            return callback(err);
        }
        callback(null, blogs);
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

function findBlogByCondition(condition, callback) {
    log.info('----------findUserByCondition------------');
    console.log(condition);
    Blog.findOne(condition, {}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}

function updateUser(id, userInfo, callback) {
    log.info('----------updateUser------------');
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
