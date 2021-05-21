import { Sequelize } from 'sequelize';
const db = new Sequelize('coffee_store', 'mehf', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

export default db;
