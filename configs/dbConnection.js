import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'mehf',
  password: 'password',
  database: 'coffee_store',
});

export default db;
