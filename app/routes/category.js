require('rootpath');
var CategoryService = require('app/service/category'),
    log = require('utils/logger')(module);

var UserOperations = {
    createCategories: createCategories,
    userSignin: userSignin,
    fetchCategories: fetchCategories,
    fetchCategoryById: fetchCategoryById,
    deleteCategoryById: deleteCategoryById,
    updateCategory: updateCategory
}

function createCategories(req, res) {
    log.info('<--------------createCategories---------------->');
    CategoryService.createCategory(req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(result);
    });
}

function userSignin(req, res) {
    log.info('<--------------userSignin---------------->');
    CategoryService.fetchCategories(req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(result);
    });
}

function fetchCategories(req, res) {
    log.info('<--------------fetchBlogs---------------->');
    CategoryService.fetchCategories(function (err, blogs) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: blogs });
    });
}

function fetchCategoryById(req, res) {
    log.info('<--------------fetchUserById---------------->');
    CategoryService.fetchCategoryById(req.params.id, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: result });
    });
}


function deleteCategoryById(req, res) {
    log.info('<--------------deleteCategoryById---------------->', req.params.id);
    CategoryService.deleteCategoryById(req.params.id, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200, data: result });
    });
}


function updateCategory(req, res) {
    log.info('<--------------updateCategory---------------->', req.body);
    CategoryService.updateCategory(req.params.id, req.body, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json({ message: "success", statusCode: 200 });
    });
}

module.exports = UserOperations;
