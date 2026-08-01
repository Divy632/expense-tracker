import asyncHandler from 'express-async-handler';
import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

// @desc    Get budgets for a month/year with spent amounts
// @route   GET /api/budgets?month=&year=
// @access  Private
export const getBudgets = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
  const year = parseInt(req.query.year, 10) || now.getFullYear();

  const budgets = await Budget.find({ user: req.user._id, month, year }).populate(
    'category',
    'name icon color'
  );

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const spentAgg = await Expense.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
        date: { $gte: startDate, $lte: endDate },
      },
    },
    { $group: { _id: '$category', spent: { $sum: '$amount' } } },
  ]);

  const spentMap = spentAgg.reduce((acc, item) => {
    acc[item._id.toString()] = item.spent;
    return acc;
  }, {});

  const result = budgets.map((b) => ({
    _id: b._id,
    category: b.category,
    amount: b.amount,
    month: b.month,
    year: b.year,
    spent: spentMap[b.category._id.toString()] || 0,
    remaining: b.amount - (spentMap[b.category._id.toString()] || 0),
    percentUsed: b.amount > 0 ? Math.round(((spentMap[b.category._id.toString()] || 0) / b.amount) * 100) : 0,
  }));

  res.json({ success: true, month, year, budgets: result });
});

// @desc    Create or update a budget for a category/month/year
// @route   POST /api/budgets
// @access  Private
export const upsertBudget = asyncHandler(async (req, res) => {
  const { category, amount, month, year } = req.body;

  if (!category || amount === undefined || !month || !year) {
    res.status(400);
    throw new Error('category, amount, month, and year are required');
  }

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, category, month, year },
    { amount },
    { new: true, upsert: true, runValidators: true }
  ).populate('category', 'name icon color');

  res.status(201).json({ success: true, budget });
});

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  await budget.deleteOne();
  res.json({ success: true, message: 'Budget deleted' });
});
