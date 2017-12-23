var db = require('../db');

module.exports = {
  messages: {
    get: function () {
      return db.getMessages();
    }, // a function which produces all the messages
    post: function (message) {
      return db.postMessage(message);
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

