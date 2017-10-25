//Require Mongoose
var mongoose = require('mongoose');
//import { mongoose } from 'mongoose';

// Define schema
var Schema = mongoose.Schema;

var CategoryModel = new Schema({
    name: String,
    type:String,
    deleted: Boolean,
    createdAt: Number,
    updatedAt: Number
});

// Compile model from schema
var CategoryModel = mongoose.model('categories', CategoryModel);

module.exports = CategoryModel;