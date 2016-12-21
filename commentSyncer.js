var amqp = require('amqplib/callback_api');
var async = require('async');
var request = require('request');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'commentSync';

        ch.assertQueue(q, {
            durable: false
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            var comment = JSON.parse(msg.content);
            async.series([
                syncComment.bind(null, comment)
            ], function(err) {
                if (err)
                    console.log('Could not sync comment due to error', err);
                else
                    console.log('Successfully synced comment');
            });
        }, {
            noAck: true
        });
    });
});

function syncComment(comment, next) {
    request({
            uri: 'http://localhost:3000/comments',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            method: 'POST',
            json: comment
        },
        function(error, res) {
            if (error)
                return next(error);
            return next();
        }
    );
}