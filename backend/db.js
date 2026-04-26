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








// require('dotenv').config();
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,

//   waitForConnections: true,
//   connectionLimit: 10,

//   ssl: {
//     rejectUnauthorized: false   // required for Aiven
//   }
// });

// module.exports = pool.promise();