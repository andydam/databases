var Sequelize = require('sequelize');

//declare database
var chatDB = new Sequelize('chat', 'student', 'student');

var messagesTbl = chatDB.define('messages', {
  text: Sequelize.STRING,
  user: Sequelize.INTEGER,
  room: Sequelize.INTEGER,
  time: Sequelize.INTEGER
}, {timestamps: false});

var usersTbl = chatDB.define('users', {
  name: Sequelize.STRING
}, {timestamps: false});

var roomsTbl = chatDB.define('rooms', {
  name: Sequelize.STRING
}, {timestamps: false});

module.exports = {
  addUser(username) {
    //adds a user to the database, returns id once added
    return new Promise((resolve, reject) => {
      usersTbl.findOrCreate({where: {name: username}})
        .then(data => resolve(data[0].id), err => reject(err));
    });
  },
  addRoom(roomname) {
    //adds a room to the database, returns id once added
    return new Promise((resolve, reject) => {
      roomsTbl.findOrCreate({where: {name: roomname}})
        .then(data => resolve(data[0].id), err => reject(err));
    });
  },
  postMessage({text, user, room, time}) {
    //posts a message to the database
    return new Promise((resolve, reject) => {
      this.addUser(user)
        .then(userId => {
          //check if user is already added to the database by attempting to add it
          //pull user id
          user = userId;
          return this.addRoom(room);
          //check if room is already added to the database by attempting to add it
        }, err => reject(err))
        .then(roomId => {
          //pull room id
          room = roomId;
          return messagesTbl.create({text, user, room, time});
          //add message to database
        }, err => reject(err))
        .then(data => {
          resolve(data.id);
        }, err => reject(err));
    });
  },
  getMessages() {
    //gets all messages from database by running a 'select from' query on the messages table
    return messagesTbl.findAll();
  },
  getUsers() {
    //gets all users from database by running a 'select from' query on the users table
    return usersTbl.findAll();
  },
  getRooms() {
    //gets all rooms from database by running a 'select from' query on the rooms table
    return roomsTbl.findAll();
  },
};