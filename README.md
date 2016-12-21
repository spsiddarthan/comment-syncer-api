# comment-syncer-api

This project contains the backend routes and the microservice which syncs the comment. The front-end (https://github.com/spsiddarthan/comment-syncer-frontend)
fires a message with the comment delte to the '/messages' end point everytime the user takes a pause while typing. If the user stays idle 
for more than three seconds, he is assumed to be taking a pause. 

The '/messages' end point sends the message to the 'commentSyncer' microservice via commentSync RabbitMQ queue. The 'commentSyncer' microservice consumes the 
message and makes a post call (technically, the post route here is an upsert route - it eithers updates or creates a comment). 
The '/comments' end point accepts the 'diffs' parameter to sync the comment. 
