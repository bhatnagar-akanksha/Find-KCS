// models/Article.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const articleSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    createdOn: { type: Object, required: true },  // You might want to consider using Date type
    publisherName: { type: String, required: true },
    subject: { type: String, required: true },    // Change Subject to subject (lowercase)
    articleURL: { type: String, required: true },
    tag: { type: [String], default: [] },          // Array of strings
    isCJA: { type: String, default: 'No' },
    status:{type:String, default:'NA'},
    publicationScope:{type:String, default:'Internal'},
    statusDescription:{type:String, default:'NA'}
});

// Middleware to set UUID before saving
articleSchema.pre('validate', function(next) {
    if (!this.uuid) {
        this.uuid = uuidv4(); // Generate UUID if it does not exist
    }
    next();
});

module.exports = mongoose.model('Article', articleSchema);
