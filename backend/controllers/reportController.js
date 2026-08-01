import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Expense from '../models/Expense.js';

// @desc    Dashboard summary: totals, balance, recent, top categories
// @route   GET /api/reports/summary
// @access  Private
export const getSummary = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [totals, monthTotals, recentExpenses, topCategories] = await Promise.all([
    Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]),
    Expense.find({ user: userId })
      .populate('category', 'name icon color')
      .sort({ date: -1 })
      .limit(5),
    Expense.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          categoryId: '$category._id',
          name: '$category.name',
          icon: '$category.icon',
          color: '$category.color',
          total: 1,
        },
      },
    ]),
  ]);

  const toMap = (arr) =>
    arr.reduce((acc, item) => {
      acc[item._id] = item.total;
      return acc;
    }, {});

  const totalMap = toMap(totals);
  const monthMap = toMap(monthTotals);

  res.json({
    success: true,
    allTime: {
      income: totalMap.income || 0,
      expense: totalMap.expense || 0,
      balance: (totalMap.income || 0) - (totalMap.expense || 0),
    },
    thisMonth: {
      income: monthMap.income || 0,
      expense: monthMap.expense || 0,
      balance: (monthMap.income || 0) - (monthMap.expense || 0),
    },
    recentExpenses,
    topCategories,
  });
});

// @desc    Spending trend over last N months
// @route   GET /api/reports/trend?months=6
// @access  Private
export const getTrend = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const months = Math.min(24, parseInt(req.query.months, 10) || 6);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const data = await Expense.aggregate([
    { $match: { user: userId, date: { $gte: start } } },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Build a complete series with zero-filled months
  const series = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const income = data.find((x) => x._id.year === year && x._id.month === month && x._id.type === 'income');
    const expense = data.find((x) => x._id.year === year && x._id.month === month && x._id.type === 'expense');
    series.push({
      label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
      year,
      month,
      income: income?.total || 0,
      expense: expense?.total || 0,
    });
  }

  res.json({ success: true, series });
});

// @desc    Category breakdown for a date range (pie/donut chart)
// @route   GET /api/reports/category-breakdown?startDate=&endDate=
// @access  Private
export const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const { startDate, endDate, type = 'expense' } = req.query;

  const match = { user: userId, type };
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const breakdown = await Expense.aggregate([
    { $match: match },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        _id: 0,
        categoryId: '$category._id',
        name: '$category.name',
        icon: '$category.icon',
        color: '$category.color',
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = breakdown.reduce((sum, item) => sum + item.total, 0);
  const withPercent = breakdown.map((item) => ({
    ...item,
    percent: grandTotal > 0 ? Math.round((item.total / grandTotal) * 1000) / 10 : 0,
  }));

  res.json({ success: true, total: grandTotal, breakdown: withPercent });
});
