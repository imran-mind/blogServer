require('rootpath');
var AuthorService = require('app/service/author'),
    log = require('utils/logger')(module);

var UserOperations = {
    createAuthor: createAuthor,
    userSignin: userSignin,
    fetchAuthors: fetchAuthors,
    fetchAuthorById: fetchAuthorById,
    updateAuthor: updateAuthor,
    deleteAuthorById:deleteAuthorById
}

function createAuthor(req, res) {
    log.info('<--------------createAuthor---------------->');
    AuthorService.createAuthor(req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(result.statusCode).json(result);
    });
}

function userSignin(req, res) {
    log.info('<--------------userSignin---------------->');
    AuthorService.fetchCategories(req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(result);
    });
}

function fetchAuthors(req, res) {
    log.info('<--------------fetchAuthors---------------->');
    AuthorService.fetchAuthors(function (err, blogs) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: blogs });
    });
}

function fetchAuthorById(req, res) {
    log.info('<--------------fetchUserById---------------->');
    AuthorService.fetchAuthorById(req.params.id, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: result });
    });
}

function updateAuthor(req, res) {
    log.info('<--------------updateAuthor---------------->');
    AuthorService.updateAuthor(req.params.id, req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: result });
    });
}

function deleteAuthorById(req, res) {
    log.info('<--------------deleteCategoryById---------------->', req.params.id);
    AuthorService.deleteAuthorById(req.params.id, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: result });
    });
}

module.exports = UserOperations;
