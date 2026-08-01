import asyncHandler from 'express-async-handler';
import Expense from '../models/Expense.js';

// @desc    Get expenses (filter, search, sort, paginate)
// @route   GET /api/expenses
// @access  Private
export const getExpenses = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'date',
    order = 'desc',
    category,
    type,
    paymentMethod,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    search,
  } = req.query;

  const filter = { user: req.user._id };

  if (category) filter.category = category;
  if (type) filter.type = type;
  if (paymentMethod) filter.paymentMethod = paymentMethod;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (minAmount || maxAmount) {
    filter.amount = {};
    if (minAmount) filter.amount.$gte = Number(minAmount);
    if (maxAmount) filter.amount.$lte = Number(maxAmount);
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;
  const sortOrder = order === 'asc' ? 1 : -1;

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .populate('category', 'name icon color type')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum),
    Expense.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: expenses.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    expenses,
  });
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate('category', 'name icon color type');

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  res.json({ success: true, expense });
});

// @desc    Create a new expense/income entry
// @route   POST /api/expenses
// @access  Private
export const createExpense = asyncHandler(async (req, res) => {
  const {
    title,
    amount,
    type,
    category,
    paymentMethod,
    date,
    notes,
    tags,
    isRecurring,
    recurringFrequency,
  } = req.body;

  if (!title || !amount || !category) {
    res.status(400);
    throw new Error('Title, amount, and category are required');
  }

  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    type: type || 'expense',
    category,
    paymentMethod: paymentMethod || 'cash',
    date: date || Date.now(),
    notes,
    tags,
    isRecurring: isRecurring || false,
    recurringFrequency: recurringFrequency || 'none',
  });

  const populated = await expense.populate('category', 'name icon color type');

  res.status(201).json({ success: true, expense: populated });
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  const updatableFields = [
    'title',
    'amount',
    'type',
    'category',
    'paymentMethod',
    'date',
    'notes',
    'tags',
    'isRecurring',
    'recurringFrequency',
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      expense[field] = req.body[field];
    }
  });

  const updated = await expense.save();
  const populated = await updated.populate('category', 'name icon color type');

  res.json({ success: true, expense: populated });
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  await expense.deleteOne();
  res.json({ success: true, message: 'Expense deleted' });
});

// @desc    Bulk delete expenses
// @route   POST /api/expenses/bulk-delete
// @access  Private
export const bulkDeleteExpenses = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error('Please provide an array of expense IDs');
  }

  const result = await Expense.deleteMany({ _id: { $in: ids }, user: req.user._id });

  res.json({
    success: true,
    message: `${result.deletedCount} expense(s) deleted`,
  });
});
