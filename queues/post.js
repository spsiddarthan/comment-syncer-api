var self = post;
var amqp = require('amqplib/callback_api');
var async = require('async');
module.exports = self;

function post(req, res) {
    var bag = {
        body: req.body
    };
    async.series([
        establishQueueConnection.bind(null, bag),
        sendMessageToQueue.bind(null, bag)
    ], function(err) {
        if (err) {
            res.status(500).send({
                'message': "Could not establish connection with microservice!",
                'error': err
            });
        } else {
            res.send({
                "message": "message sent successfully!"
            });
        }
    });
}

function establishQueueConnection(bag, next) {
    amqp.connect('amqp://localhost', function(err, conn) {
        if (err)
            return next(err);
        conn.createChannel(function(err, ch) {
            var q = 'commentSync';

            bag.ch = ch;
            ch.assertQueue(q, {
                durable: true
            });
            return next();

        });
    });
}

function sendMessageToQueue(bag, next) {
    bag.ch.sendToQueue('commentSync', new Buffer(JSON.stringify(bag.body)), {persistent: true});
    return next();
}