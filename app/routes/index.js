'use strict'
require('rootpath');
var express = require('express'),
    validate = require('express-validation'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    router = express.Router();

var auth = require('app/helpers/auth'),
    userRoute = require('app/routes/user'),
    categoryRoute = require('app/routes/category'),
    blogRoute = require('app/routes/blog'),
    authorRoute = require('app/routes/author');


router.post('/users/signup', userRoute.userSignup);
router.post('/users/signin', userRoute.userSignin);
router.get('/users', userRoute.fetchUsers);
router.get('/users/:userId', userRoute.fetchUserById);
router.put('/users/:userId', userRoute.updateUser);

router.get('/categories', auth.ensureAuthenticated, categoryRoute.fetchCategories);
router.get('/categories/:id', auth.ensureAuthenticated, categoryRoute.fetchCategoryById);
router.post('/categories', auth.ensureAuthenticated, categoryRoute.createCategories);
router.put('/categories/:id', auth.ensureAuthenticated, categoryRoute.updateCategory);
router.delete('/categories/:id', auth.ensureAuthenticated, categoryRoute.deleteCategoryById);

router.get('/blogs', blogRoute.fetchBlogs);
router.post('/blogs', blogRoute.createBlog);

router.get('/authors', authorRoute.fetchAuthors)
router.post('/authors', authorRoute.createAuthor);

router.get('/authors/:id', authorRoute.fetchAuthorById);
router.put('/authors/:id', authorRoute.updateAuthor);
router.delete('/authors/:id', authorRoute.deleteAuthorById);

module.exports = function (app) {
    app
        .all('/*', function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Authorization', true);
            res.header('Access-Control-Allow-Headers', 'Origin,Content-type,X-Requested-With,Accept,Authorization,X-Token');
            if (req.method == 'OPTIONS') {
                res.status(200).end();
            } else {
                next();
            }
        })
        .use(express.static(path.join(__dirname, '../../public')))
        //.all('/api/v1/*', [])
        .use(express.static(path.join(__dirname, '/../../../')))
        .use(require('morgan')('combined', { "stream": logger.stream }))
        .use(bodyParser.json({ limit: '5mb' }))
        .use(express.static('apidoc'))
        .use(bodyParser.urlencoded({ extended: false })); // persistent login sessions
    return router;
}
