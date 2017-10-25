

var log = require('utils/logger')(module);
var Author = require('app/models/author');

var UserOperations = {
    createAuthor: createAuthor,
    fetchAuthors: fetchAuthors,
    fetchAuthorById: fetchAuthorById,
    findAuthorByCondition: findAuthorByCondition,
    updateAuthor: updateAuthor,
    deleteAuthorById: deleteAuthorById
}
function createAuthor(author, callback) {
    log.info('----------author------------', JSON.stringify(author));
    author.save(function (err) {
        if (err) {
            return callback(err);
        }
        console.log('--------------success--------------');
        callback(null, 'result');
    });
}

function fetchAuthors(callback) {
    log.info('----------fetchBlogs------------');
    Author.find({}, { deleted: 0 }, function (err, blogs) {
        if (err) {
            return callback(err);
        }
        callback(null, blogs);
    });
}

function fetchAuthorById(id, callback) {
    log.info('----------fetchAuthorById------------');
    Author.findOne({ _id: id /*ObjectId(id)*/ }, { __v: 0 }, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}

function findAuthorByCondition(condition, callback) {
    log.info('----------findAuthorByCondition------------');
    console.log(condition);
    Author.findOne(condition, {}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}

function updateAuthor(id, userInfo, callback) {
    log.info('----------updateAuthor------------');
    Author.update({ _id: id }, userInfo, function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}

function deleteAuthorById(id, callback) {
    log.info('----------deleteAuthorById------------');
    Author.remove({ _id: id }, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}



module.exports = UserOperations;
