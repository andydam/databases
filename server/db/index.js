var mysql = require('mysql');

var chatDB = mysql.createConnection({
  user: 'student',
  password: 'student',
  database: 'chat'
});

chatDB.connect();

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

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".
module.exports = {
  chatDB,
  getUser(username) {
    return new Promise((resolve, reject) => {
      this.chatDB.queryAsync('SELECT * FROM users WHERE name = ?', [username])
        .then(data => {
          data.length > 0 ? resolve(data[0].id) : resolve(false);
        }, err => reject(err));
    });
  },
  addUser(username) {
    return new Promise((resolve, reject) => {
      this.getUser(username)
        .then(status => {
          return status !== false ? resolve(status) : this.chatDB.queryAsync('INSERT INTO users (name) VALUES (?)', [username]);
        }, err => reject(err))
        .then(data => {
          data.affectedRows > 0 ? resolve(data.insertId) : reject(data.serverStatus);
        }, err => reject(err));
    });
  },
  getRoom(room) {

  },
  addRoom(room) {

  },
  postMessage(message) {

  }
};