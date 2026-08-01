import { useEffect, useState } from 'react';
import { formatDateInput } from '../utils/format.js';

const inputClass =
  'w-full rounded-lg bg-ink border border-white/10 px-3 py-2.5 text-sm text-paper placeholder:text-slate-light focus:border-gold/60 focus:outline-none transition-colors';
const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-light';

const emptyForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: '',
  paymentMethod: 'cash',
  date: formatDateInput(new Date()),
  notes: '',
  tags: '',
  isRecurring: false,
  recurringFrequency: 'none',
};

const ExpenseForm = ({ initialData, categories, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount ?? '',
        type: initialData.type || 'expense',
        category: initialData.category?._id || initialData.category || '',
        paymentMethod: initialData.paymentMethod || 'cash',
        date: formatDateInput(initialData.date || new Date()),
        notes: initialData.notes || '',
        tags: (initialData.tags || []).join(', '),
        isRecurring: initialData.isRecurring || false,
        recurringFrequency: initialData.recurringFrequency || 'none',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Enter a valid amount';
    if (!form.category) next.category = 'Choose a category';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      amount: Number(form.amount),
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {['expense', 'income'].map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setForm((f) => ({ ...f, type: t, category: '' }))}
            className={`rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
              form.type === t
                ? t === 'expense'
                  ? 'bg-rust/20 text-rust-light border border-rust/40'
                  : 'bg-ledger/20 text-ledger-light border border-ledger/40'
                : 'bg-ink border border-white/10 text-slate-light'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        <label className={labelClass}>Title</label>
        <input
          className={inputClass}
          placeholder="e.g. Grocery run at Whole Foods"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        {errors.title && <p className="mt-1 text-xs text-rust-light">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={`${inputClass} font-mono`}
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          />
          {errors.amount && <p className="mt-1 text-xs text-rust-light">{errors.amount}</p>}
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <select
          className={inputClass}
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        >
          <option value="">Select a category</option>
          {filteredCategories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-rust-light">{errors.category}</p>}
      </div>

      <div>
        <label className={labelClass}>Payment Method</label>
        <select
          className={inputClass}
          value={form.paymentMethod}
          onChange={(e) => setForm((f) => ({ ...f, paymentMethod: e.target.value }))}
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="wallet">Wallet</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Tags (comma separated)</label>
        <input
          className={inputClass}
          placeholder="groceries, weekly"
          value={form.tags}
          onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
        />
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={2}
          placeholder="Optional details..."
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-light">
        <input
          type="checkbox"
          checked={form.isRecurring}
          onChange={(e) => setForm((f) => ({ ...f, isRecurring: e.target.checked }))}
          className="h-4 w-4 rounded border-white/20 bg-ink accent-gold"
        />
        This is a recurring entry
      </label>

      {form.isRecurring && (
        <select
          className={inputClass}
          value={form.recurringFrequency}
          onChange={(e) => setForm((f) => ({ ...f, recurringFrequency: e.target.value }))}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-light hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold-light transition-colors disabled:opacity-60"
        >
          {submitting ? 'Saving...' : initialData ? 'Update Entry' : 'Add Entry'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
