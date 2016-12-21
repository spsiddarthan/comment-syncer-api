var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var commentsSchema = new Schema({
    userId: String,
    questionId: String,
    commentId: String,
    commentText: String,
    isCreated: Boolean,
    upvotes: Number,
    downvotes: Number,
    createdAt: Date,
    updatedAt: Date
});
var Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;