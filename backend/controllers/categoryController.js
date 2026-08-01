import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Expense from '../models/Expense.js';

// @desc    Get all categories for logged-in user
// @route   GET /api/categories
// @access  Private
export const getCategories = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = { user: req.user._id };
  if (type) filter.type = type;

  const categories = await Category.find(filter).sort({ isDefault: -1, name: 1 });
  res.json({ success: true, count: categories.length, categories });
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
export const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, color, type } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const category = await Category.create({
    user: req.user._id,
    name,
    icon,
    color,
    type: type || 'expense',
  });

  res.status(201).json({ success: true, category });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, icon, color } = req.body;
  if (name !== undefined) category.name = name;
  if (icon !== undefined) category.icon = icon;
  if (color !== undefined) category.color = color;

  const updated = await category.save();
  res.json({ success: true, category: updated });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (category.isDefault) {
    res.status(400);
    throw new Error('Default categories cannot be deleted');
  }

  const inUse = await Expense.countDocuments({ category: category._id });
  if (inUse > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete: ${inUse} expense(s) use this category. Reassign or delete them first.`
    );
  }

  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});
