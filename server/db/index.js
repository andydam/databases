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
  getID(value, field, table) {
    //returns id of value if in table, returns false if not in table
    return new Promise((resolve, reject) => {
      chatDB.queryAsync('SELECT * FROM ?? WHERE ?? = ?', [table, field, value])
        .then(data => {
          data.length > 0 ? resolve(data[0].id) : resolve(false);
        }, err => reject(err));
    });
  },
  insertTo(value, field, table) {
    //inserts value to table, returns id if inserted successfully or if already inserted
    return new Promise((resolve, reject) => {
      this.getID(value, field, table)
        .then(status => {
          return status !== false ? resolve(status) : chatDB.queryAsync('INSERT INTO ?? (??) VALUES (?)', [table, field, value]);
        }, err => reject(err))
        .then(data => {
          data.affectedRows > 0 ? resolve(data.insertId) : reject(data.serverStatus);
        }, err => reject(err));
    });
  },
  getUser(username) {
    //checks to see if a user exists in the database
    //passes user id if in database, false if not
    return this.getID(username, 'name', 'users');
  },
  addUser(username) {
    //adds a user to the database
    //returns user id of new user or user id if user already exists
    return this.insertTo(username, 'name', 'users');
  },
  getRoom(room) {
    //checks to see if room exists in the database
    //passes room id if in database, false if not
    return this.getID(room, 'name', 'rooms');
  },
  addRoom(room) {
    //adds a room to the database
    //returns room id of new room or room id if room already exists
    return this.insertTo(room, 'name', 'rooms');
  },
  postMessage(message) {

  }
};

module.exports.getUser('andy')
  .then(data => console.log(data));