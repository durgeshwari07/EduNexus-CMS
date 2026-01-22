const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Default XAMPP username
  password: '',      // Default XAMPP password is empty
  database: 'college_system', // Create this in phpMyAdmin
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool.promise();