import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "admin",
  password: "a12345",
  database: "okaly"
});

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'yalan',
//   password: '860212',
//   database: 'product',
//   port: 3306,
// });

export default connection;