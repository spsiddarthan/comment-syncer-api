var express = require('express');
var mongoose = require('mongoose');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var postComments = require('./comments/post.js');
var postMessages = require('./queues/post.js');

mongoose.connect('mongodb://localhost/hashnode-db');

app.post('/comments', postComments);
app.post('/messages', postMessages);
app.listen(3000, function() {
    console.log('the api is listening on port 3000!')
});