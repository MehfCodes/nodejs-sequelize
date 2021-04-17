import express from 'express';
// import db from './configs/dbConnection.js';
import customersRouters from './routes/customers.js';
import { Sequelize } from 'sequelize';
// import {} from 'mys'
const app = express();

const db = new Sequelize('', 'mehf', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

(async () => {
  try {
    await db.authenticate();
    await db.query('create database if not exists coffee_store');
    console.log('database connected...');
  } catch (error) {
    console.log(error);
  }
})();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/customers', customersRouters);

app.listen(6000, () => {
  console.log('server started on 6000 ...');
});
