import { Router } from 'express';
import db from '../configs/dbConnection.js';
const router = Router();
router.post('/', (req, res) => {
  const sql = 'insert into customers set ?';
  //   console.log(req.body);
  db.query(sql, req.body, (err, result, fields) => {
    res.json({ result, fields });
  });
});
router.get('/', (req, res) => {
  const sql = 'select * from customers';
  //   console.log(req.body);
  db.query(sql, (err, result, fields) => {
    res.json({ result });
  });
});
router.patch('/', (req, res) => {
  const sql = 'update customers set ?';
  //   console.log(req.body);
  db.query(sql, req.body, (err, result, fields) => {
    res.json({ result });
  });
});
router.delete('/', (req, res) => {
  const sql = 'delete from customers where ?';
  //   console.log(req.body);
  db.query(sql, req.body, (err, result, fields) => {
    res.json({ result });
  });
});

export default router;
