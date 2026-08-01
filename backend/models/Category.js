import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: 40,
    },
    icon: {
      type: String,
      default: '\uD83D\uDCC1', // folder emoji fallback
    },
    color: {
      type: String,
      default: '#1F6F5C',
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
