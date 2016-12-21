var self = post;
var async = require('async');
var dmpmod = require('diff_match_patch');
var dmp = new dmpmod.diff_match_patch();
var Comments = require('./Schema.js');

module.exports = self;

function post(req, res) {
    var bag = {};
    bag.body = req.body;
    async.series([
        checkInputParams.bind(null, bag),
        findExistingComment.bind(null, bag),
        createComment.bind(null, bag),
        updateComment.bind(null, bag)
    ], function(err) {
        if (err)
            res.status(500).send({
                'error': err
            });
        else
            res.send({
                "comment": bag.comment
            });

    });
}

function checkInputParams(bag, next) {
    if (!bag.body.commentId)
        return next('commentId is a required parameter!');

    if (!bag.body.questionId)
        return next('questionId is a required parameter!');

    if (!bag.body.commentText)
        return next('commentText is a required parameter!');

    if (!bag.body.userId)
        return next('userId is a required parameter!');

    if (!bag.body.diffs)
        return next('diffs is a required parameter!');

    return next();
}

function findExistingComment(bag, next) {
    Comments.findOne({
            "commentId": bag.body.commentId
        },
        function(err, comment) {
            if (err) return next(err);

            if (comment) {
                bag.comment = comment;
                bag.commentExists = true;

            }
            return next();
        }
    );
}

function createComment(bag, next) {
    if (bag.commentExists) return next();

    var comment = {
        commentId: bag.body.commentId,
        questionId: bag.body.questionId,
        userId: bag.body.userId,
        commentText: bag.body.commentText
    };

    if (bag.body.isCreated)
        comment.isCreated = bag.body.isCreated;

    if (bag.body.upvotes)
        comment.upvotes = bag.body.upvotes;

    if (bag.body.downvotes)
        comment.downvotes = bag.body.downvotes;

    Comments.create(comment,
        function(err, comment) {
            if (err) return next(err);

            bag.comment = comment;
            return next();
        }
    );
}

function updateComment(bag, next) {
    if (!bag.commentExists) return next();

    if (bag.body.isCreated)
        bag.comment.isCreated = bag.body.isCreated;

    var patch = dmp.patch_make(bag.comment.commentText, bag.body.diffs);
    var commentText = dmp.patch_apply(patch, bag.comment.commentText)[0];

    Comments.findOneAndUpdate({
            commentId: bag.comment.commentId
        }, {
            $set: {
                isCreated: bag.body.isCreated || false,
                commentText: commentText
            }
        }, {
            new: true
        },
        function(err, comment) {
            if (err) return next(err);

            bag.comment = comment;
            return next();
        }
    );
}