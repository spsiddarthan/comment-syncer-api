var express = require('express');
var mongoose = require('mongoose');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

var postComments = require('./comments/post.js');

mongoose.connect('mongodb://localhost/hashnode-db');

app.post('/comments', postComments);
app.listen(3000, function() {
    console.log('the api is listening on port 3000!')
});