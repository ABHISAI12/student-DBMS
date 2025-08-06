// src/config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your_password', // IMPORTANT: Use your actual password
  database: process.env.DB_NAME || 'student_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to the MySQL database!');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  });

module.exports = pool;