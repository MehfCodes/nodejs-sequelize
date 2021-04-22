import express from 'express';
import db from './configs/dbConnection.js';
import customersRouters from './routes/customer.routes.js';

const app = express();
try {
  await db.authenticate();
  await db.query('create database if not exists coffee_store');
  console.log('database connected...');
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', customersRouters);
app.use((error, req, res, next) => {
  console.log('status', error.status);
  res.json({ message: error.message, error });
});
app.listen(6000, () => {
  console.log('server started on 6000 ...');
});
