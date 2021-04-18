import { Router } from 'express';
// import db from '../configs/dbConnection.js';
import {
  deleteUser,
  getAllUser,
  signUp,
  updateUser,
} from '../controllers/customers.controller.js';
const router = Router();
router.route('/').get(getAllUser).post(signUp);
router.route('/:id').patch(updateUser).delete(deleteUser);

export default router;
