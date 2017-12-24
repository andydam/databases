var models = require('../models');

//create an object to store headers used for all responses
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'content-type': 'application/json'
};

module.exports = {
  messages: {
    get(req, res) {
      //handles get request for all messages
      models.messages.get()
        //use messages model to get all messages
        .then(messages => {
          //add appropriate headers to response
          res.writeHead(200, defaultCorsHeaders);
          //add messages to response and end response
          res.end(JSON.stringify({results: messages}));
        }, err => {
          //messages model errored out in getting all messages
          //send response containing 400 code and error
          res.writeHead(400, defaultCorsHeaders);
          res.end(JSON.stringify(err));
        });
    }, 
    post(req, res) {
      //handles post request to add a message to the database
      //use messages model to post message to database
      models.messages.post(req.body)
        .then(returnObj => {
          //add appropriate headers to response
          res.writeHead(201, defaultCorsHeaders);
          //add response object to response and end response
          res.end(JSON.stringify(returnObj));
        }, err => {
          //messages model errored out in posting message
          //send response containing 400 code and error
          res.writeHead(400, defaultCorsHeaders);
          res.end(JSON.stringify(err));
        });
    }
  },

  users: {
    get(req, res) {
      //handles a get request for all users
      models.users.get()
        //uses users model to get all users
        .then(users => {
          //add appropriate headers to response
          res.writeHead(200, defaultCorsHeaders);
          //add users to response and end response
          res.end(JSON.stringify({results: users}));
        }, err => {
          //users model errored out in getting all users
          //send response containing 400 code and error
          res.writeHead(400, defaultCorsHeaders);
          res.end(JSON.stringify(err));
        });
    },
    post(req, res) {
      //handles a  post request to add a user to the database
      //use users model to post user to database
      models.users.post(req.body)
        .then(returnObj => {
          //add appropriate headers to response
          res.writeHead(201, defaultCorsHeaders);
          //add response object to response and end response
          res.end(JSON.stringify(returnObj));
        }, err => {
          //users model errored out in posting user
          //send response containing 400 code and error
          res.writeHead(400, defaultCorsHeaders);
          res.end(JSON.stringify(err));
        });
    }
  }
};

