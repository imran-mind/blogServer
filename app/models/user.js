//Require Mongoose
var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var UserModel = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    phone: { type: Number, min: 10, max: 13 },
    deleted: Boolean,
    created_at: Number,
    updated_at: Number
});

// Compile model from schema
var UserModel = mongoose.model('users', UserModel);

module.exports = UserModel;