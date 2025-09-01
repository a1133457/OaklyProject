import mysql from "mysql2/promise";

// 學校電腦
const connection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "admin",
  password: "a12345",
  database: "oakly"
});


// 雅嵐
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'product',
//   port: 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,})
// export default pool;

// 欣錞
// const connection = mysql.createPool({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "1234",
//   database: "oakly"
// });

export default connection;