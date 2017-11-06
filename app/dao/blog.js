

var log = require('utils/logger')(module);
var Blog = require('app/models/blog');

var UserOperations = {
    createBlog: createBlog,
    fetchBlogs: fetchBlogs,
    fetchBlogById: fetchBlogById,
    findBlogByCondition: findBlogByCondition,
    updateBlog: updateBlog,
    deleteBlogById: deleteBlogById
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

function fetchBlogById(id, callback) {
    log.info('----------fetchBlogById------------');
    Blog.findOne({ _id: id /*ObjectId(id)*/ }, { __v: 0, deleted: 0, createdAt: 0, updatedAt: 0 }, function (err, user) {
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

function updateBlog(id, blogInfo, callback) {
    log.info('----------updateBlog------------');
    Blog.update({ _id: id }, blogInfo, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}

function deleteBlogById(id, callback) {
    log.info('----------deleteBlogById------------');
    Blog.remove({ _id: id }, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}


module.exports = UserOperations;
