var mysql = require('mysql');

//declare database
var chatDB = mysql.createConnection({
  user: 'student',
  password: 'student',
  database: 'chat'
});

//connect to database
chatDB.connect();

//promisified mysql query method
chatDB.queryAsync = function (...args) {
  return new Promise((resolve, reject) => {
    this.query(...args, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  selectVal(desired, from, where, filter) {
    //runs a select query on database using passed in arguments
    return new Promise((resolve, reject) => {
      //run a 'select from where' mysql async query
      chatDB.queryAsync('SELECT ?? FROM ?? WHERE ?? = ?', [desired, from, where, filter])
        .then(data => {
          //if data is returned, return the data, else return false
          data.length ? resolve(data[0][desired]) : resolve(false);
        }, err => reject(err));
    });
  },
  insertTo(table, key, value) {
    //inserts data to the database using passed in arguements, returns id inserted at if insert successful 
    return new Promise((resolve, reject) => {
      //check if data is already in table by attempting to get the id
      this.selectVal('id', table, key, value)
        .then(status => {
          //if able to get id of data, data already exists in database, return id of data
          //if not able to, run a 'insert into values' mysql async query
          return status !== false ? {affectedRows: status, insertId: status} : chatDB.queryAsync('INSERT INTO ?? (??) VALUES (?)', [table, key, value]);
        }, err => reject(err))
        .then(data => {
          //if data was successfully added, return the id of data, else return server response
          data.affectedRows ? resolve(data.insertId) : reject(data.serverStatus);
        }, err => reject(err));
    });
  },
  getUserID(username) {
    //gets user id for a given username, returns false if user is not in database
    return this.selectVal('id', 'users', 'name', username);
  },
  getUserName(userId) {
    //gets username for a given user id, returns false if user is not in database
    return this.selectVal('name', 'users', 'id',userId);
  },
  addUser(username) {
    //adds a user to the database, returns id once added
    return this.insertTo('users', 'name', username);
  },
  getRoomID(roomname) {
    //gets room id for a given room name, returns false if room is not in database
    return this.selectVal('id', 'rooms', 'name', roomname);
  },
  getRoomName(roomId) {
    //gets room name for a given room id, returns false if room is not in database
    return this.selectVal('name', 'rooms', 'id', roomId);
  },
  addRoom(roomname) {
    //adds a room to the database, returns id once added
    return this.insertTo('rooms', 'name', roomname);
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
          return chatDB.queryAsync('INSERT INTO messages (text, user, room, time) VALUES (?, ?, ?, ?)', [text, Number(user), Number(room), Number(time)]);
        }, err => reject(err))
        .then(data => {
          //add message to database by running a 'insert into values' mysql async query
          //if message was successfully added, return message id, else return server response
          data.affectedRows ? resolve(data.insertId) : reject(data.serverStatus);
        }, err => reject(err));
    });
  },
  getMessages() {
    //gets all messages from database by running a 'select from' query on the messages table
    return chatDB.queryAsync('SELECT * FROM messages');
  },
  getUsers() {
    //gets all users from database by running a 'select from' query on the users table
    return chatDB.queryAsync('SELECT * from users');
  },
  getRooms() {
    //gets all rooms from database by running a 'select from' query on the rooms table
    return chatDB.queryAsync('SELECT * from rooms');
  },
};