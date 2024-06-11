const mysql = require("mysql");
// const mysql = require("mysql2/promise");
const util = require("util");

if (process.env.NODE_ENV != "production") {
   require("dotenv").config({ path: "./.env" });
}

const pool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
});
// const pool = mysql.createPool({
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   host: process.env.MYSQL_HOST,
// });
// MYSQL_HOST = db;
// MYSQL_USER = user1;
// MYSQL_PASSWORD = 12345;
// MYSQL_DATABASE = database;
// pool.query = util.promisify(pool.query).bind(pool);

// const query = "SELECT * FROM users";
// pool.execute(query, (err, results) => {
//   if (!results) {
//     res.json({ status: "Not found" });
//   } else {
//     res.json(results);
//   }
// });

// Promisify the query method for async/await
pool.query = util.promisify(pool.query);

module.exports = pool;
