

var log = require('utils/logger')(module);
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');
var Category = require('app/models').Category;

var CategoryOperations = {
    createCategory: createCategory,
    fetchCategories: fetchCategories,
    fetchCategoryById: fetchCategoryById,
    findCategorByCondition: findCategorByCondition,
    updateCategory: updateCategory,
    deleteCategoryById: deleteCategoryById
}

function createCategory(category, callback) {
    log.info('----------category------------', JSON.stringify(category));
    category.save(function (err) {
        if (err) {
            return callback(err);
        }
        console.log('--------------success--------------');
        callback(null, 'result');
    });
}

function fetchCategories(callback) {
    log.info('----------fetchCategories------------');
    Category.find(function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(null, users);
    });
}

function fetchCategoryById(id, callback) {
    log.info('----------fetchUserById------------');
    Category.findOne({ _id: id }, { deleted: 0 }, function (err, category) {
        if (err) {
            return callback(err);
        }
        callback(null, category);
    });
}


function findCategorByCondition(condition, callback) {
    log.info('----------findCategorByCondition------------');
    console.log(condition);
    Category.findOne(condition, { username: 1, password: 1, _id: 1 }, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}


function updateCategory(id, categoryInfo, callback) {
    log.info('----------updateCategory------------');
    Category.update({ _id: id }, categoryInfo, function (err, category) {
        if (err) {
            return callback(err);
        }
        callback(null, category);
    });
}

function deleteCategoryById(id, callback) {
    log.info('----------deleteCategoryById------------');
    Category.remove({ _id: id }, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
}


module.exports = CategoryOperations;
