# comment-syncer-api

This project contains the backend routes and the microservice which syncs the comment. The front-end (https://github.com/spsiddarthan/comment-syncer-frontend)
fires a message with the comment delte to the '/messages' end point everytime the user takes a pause while typing. If the user stays idle for more than three seconds, he is assumed to be taking a pause. 

The '/messages' end point sends the message to the 'commentSyncer' microservice via commentSync RabbitMQ queue. The 'commentSyncer' microservice consumes the 
message and makes a post call (technically, the post route here is an upsert route - it eithers updates or creates a comment). 
The '/comments' end point accepts the 'diffs' parameter to sync the comment. 

The api uses the Mongoose to connect with MongoDB. 

Usage: After cloning the project, do a `npm install` to install the dependencies. MongoDB and RabbitMQ are running with their default configurations. 

The command `node app.js` will bring the api up and the command `node commentSyncer.js` will bring the commentSyncer microservice api up (I added commentSyncer to the same repository for simplicity, ideally it would have been a repo of its own). 
