import express from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  bulkDeleteExpenses,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getExpenses).post(createExpense);
router.post('/bulk-delete', bulkDeleteExpenses);
router.route('/:id').get(getExpenseById).put(updateExpense).delete(deleteExpense);

export default router;
