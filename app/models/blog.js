//Require Mongoose
var mongoose = require('mongoose');
//import { mongoose } from 'mongoose';

// Define schema
var Schema = mongoose.Schema;

var BlogModel = new Schema({
    name: String,
    title: String,
    subtitle: String,
    content: String,
    deleted: Boolean,
    createdAt: Number,
    updatedAt: Number
});

// Compile model from schema
var BlogModel = mongoose.model('blogs', BlogModel);

module.exports = BlogModel;