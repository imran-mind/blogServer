//Require Mongoose
var mongoose = require('mongoose');
//import { mongoose } from 'mongoose';

// Define schema
var Schema = mongoose.Schema;

var AuthorModel = new Schema({
    name: String,
    email: String,
    mobile: Number,
    deleted: Boolean,
    createdAt: Number,
    updatedAt: Number
});

// Compile model from schema
var AuthorModel = mongoose.model('authors', AuthorModel);

module.exports = AuthorModel;