// Create web server

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const posts = {};

// Get all comments for a post
app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;

  res.status(200).send(posts[id] || []);
});

// Create a new comment for a post
app.post('/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // Create a new comment
  const comment = { id: Math.random().toString(36).substr(2, 9), content };

  // Get all comments for this post
  const comments = posts[id] || [];

  // Add new comment to comments
  comments.push(comment);

  // Add comments to posts
  posts[id] = comments;

  // Send event to event-bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      ...comment,
      postId: id,
    },
  });

  res.status(201).send(comments);
});

// Receive events from event-bus
app.post('/events', (req, res) => {
  console.log('Received event: ', req.body.type);

  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on port 4001');
});