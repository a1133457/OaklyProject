import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "admin",
  password: "a12345",
  database: "restful"
});

export default connection;