
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

// Ensure the connection is pointing to the right database
const Tag = mongoose.model('Tag', tagSchema, 'tags'); // Explicitly specify the collection name

module.exports = Tag;