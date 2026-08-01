import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'bank_transfer', 'wallet', 'other'],
      default: 'cash',
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    tags: [{ type: String, trim: true, maxlength: 30 }],
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none',
    },
    attachmentUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ title: 'text', notes: 'text', tags: 'text' });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
