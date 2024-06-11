const mysql = require('mysql');
const util = require('util');

// Create a MySQL pool
const pool = mysql.createPool({
  host: 'localhost', // Replace with your database host
  user: 'root',      // Replace with your database user
  password: '',      // Replace with your database password
  database: 'your_database', // Replace with your database name
});

// Promisify the query method for async/await
pool.query = util.promisify(pool.query);

module.exports = pool;
