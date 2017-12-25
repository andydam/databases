var db = require('../db');

module.exports = {
  messages: {
    get() {
      return new Promise((resolve, reject) => {
        //declare variables to store messages and users
        let messages = [];
        let users = [];
        db.getMessages()
          .then(data => {
            //pull messages from database
            messages = data;
            return db.getUsers();
          }, err => reject(err))
          .then(data => {
            //pull users from database
            users = data;
            return db.getRooms();
          }, err => reject(err))
          .then(rooms =>{
            //pull rooms from database
            resolve(messages.map(oldMessage => {
              //transform database message object into a chatterbox message object
              let message = {};
              message.text = oldMessage.text;
              message.username = users.filter(user => user.id = oldMessage.user)[0].name;
              message.roomname = rooms.filter(room => room.id = oldMessage.room)[0].name;
              message.createdAt = new Date(oldMessage.time).toJSON();
              message.updatedAt = message.createdAt;
              return message;
            }));
          }, err => reject(err));
      });
    },
    post(message, time = new Date().getTime()) {
      return new Promise((resolve, reject) => {
        //post message to database
        db.postMessage({text: message.message, user: message.username, room: message.roomname, time})
          .then(id => {
            //if post successful, return back response object
            id ? resolve({
              objectId: time,
              createdAt: new Date(time).toJSON()
            }) : reject(id);
          }, err => reject(err));
      });
    }
  },

  users: {
    get() {
      return db.getUsers();
    },
    post(user) {
      return db.addUser(user.username);
    }
  }
};

