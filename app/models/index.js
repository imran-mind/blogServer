//Import the mongoose module
var mongoose = require('mongoose');
var UserModel = require('./user');
var CategoryModel = require('./category');
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/blogs';
mongoose.connect(mongoDB, {
    useMongoClient: true
});
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var models = {};
models.User = UserModel;
models.Category = CategoryModel;
module.exports = models;
